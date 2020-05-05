var express = require('express')
var router = express.Router()
var request = require('request') // npm i -S request
var config = require('./../config.json')
var baseUrl = config.baseUrl
var formUrl = baseUrl + 'home/datastore_search'

// Show form with default values
router.get('/', function(req, res){
    var default_wso2_gateway_url = config.default_wso2_gateway_url
    var default_wso2_ckan_context = config.default_wso2_ckan_context
    var default_wso2_subscription_key = config.default_wso2_subscription_key
    var default_ckan_resource_id = config.default_ckan_resource_id
    var default_ckan_api_key = config.default_ckan_api_key
    var default_max_records = config.default_max_records
    var default_record_offset = config.default_record_offset
    res.render('home', {
        formUrl: formUrl,
        wso2_gateway_url: default_wso2_gateway_url,
        wso2_ckan_context: default_wso2_ckan_context,
        wso2_subscription_key: default_wso2_subscription_key,
        ckan_resource_id: default_ckan_resource_id,
        ckan_api_key: default_ckan_api_key,
        max_records: default_max_records,
        record_offset: default_record_offset
    })
})

// Process form values. Re-display form with selected values and results.
router.post('/datastore_search', function(req, res){
    var wso2_gateway_url = req.body.wso2_gateway_url
    var wso2_ckan_context = req.body.wso2_ckan_context
    var wso2_subscription_key = req.body.wso2_subscription_key
    var ckan_resource_id = req.body.ckan_resource_id
    var ckan_api_key = req.body.ckan_api_key
    var search_term = req.body.search_term
    var max_records = req.body.max_records
    var record_offset = req.body.record_offset

    // ===================================================
    // Construct url based on input
    // ===================================================
    // Strip leading/trailing slashes
    wso2_gateway_url = wso2_gateway_url.replace(/^\/|\/$/g, '')
    wso2_ckan_context = wso2_ckan_context.replace(/^\/|\/$/g, '')
    // Construct URL
    var wso2_request_url = wso2_gateway_url + '/' + wso2_ckan_context + '/action/datastore_search?id=' + ckan_resource_id + '&limit=' + max_records + '&offset=' + record_offset
    // Append optional search term
    if (search_term != '') {
        wso2_request_url = wso2_request_url + '&q=' + search_term
    }

    // ===================================================
    // Invoke API
    // ===================================================
    const options = {
        url: wso2_request_url,
        method: 'GET',
        timeout: 1500,
        headers: {
            Authorization : 'Bearer ' + wso2_subscription_key,
            'X-CKAN-API-Key' : ckan_api_key
        }
    }
    request(options, (err, response, body) => {
        var gateway_response
        var gateway_response_json
        if (err) { 
            console.log('err:', err)
            var mock_response = '{"help": "https://mock.url/api/3/action/datastore_search?id=mock", "success": true, "result": ["THIS IS A MOCK RESPONSE", "a", "b", "c", "d", "e", "f", "g"]}'
            body = mock_response
        }
        gateway_response = body
        console.log('*************************')
        console.log('body:', body)
        console.log('*************************')
        try {
            gateway_response_json = JSON.parse(gateway_response)
        } catch (e) {
            console.log('Error: body object is not valid JSON')
            gateway_response_json = '{"error": "body object is not valid JSON","result": { "body": "'+encodeURIComponent(body)+'" }}'
        }
        // ===================================================
        // Save payload to disk
        // ===================================================
        var filepath='public/output/'
        var filedata = gateway_response
        const { v4: uuidv4 } = require('uuid') // npm i -S uuid
        var guid = uuidv4()
        var filenameprefix=getRawDate() + '_' + guid
        var filename = filenameprefix + '.json'
        write_data_to_disk(filepath, filename, filedata)

        // ===================================================
        // Return Response
        // ===================================================
        res.render('home', {
            err: err,
            formUrl: formUrl,
            wso2_gateway_url: wso2_gateway_url,
            wso2_ckan_context: wso2_ckan_context,
            wso2_subscription_key: wso2_subscription_key,
            ckan_resource_id: ckan_resource_id,
            ckan_api_key: ckan_api_key,
            search_term: search_term,
            max_records: max_records,
            record_offset: record_offset,
            wso2_request_url: wso2_request_url,
            gateway_response: gateway_response,
            gateway_response_json: gateway_response_json,
            filename: filename
        })    
    })
})

module.exports = router

function write_data_to_disk(filepath, filename, filedata) {
    var fs = require('fs')
    if (!fs.existsSync(filepath)){
        console.log('Creating folder ' + filepath)
        fs.mkdirSync(filepath)
    }
    console.log('Writing to file ' + filepath+filename)
    console.log('Writing data ' + filedata)
    fs.writeFile (filepath+filename, filedata, function(err) {
        if (err) throw err
    })
}

function getRawDate() {
    var date = new Date()
    var moment = require('moment-timezone') // npm i -S moment-timezone
    var dt = moment.tz(date, 'America/Los_Angeles')
    dt = dt.format('YYYYMMDDHHmmssSSS')
    return dt
}