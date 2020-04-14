var express = require('express')
var router = express.Router()
var config = require('./../config.json')

// Show form with default values
router.get('/', function(req, res){
    var default_wso2_gateway_url = config.default_wso2_gateway_url
    var default_wso2_ckan_context = config.default_wso2_ckan_context
    var default_wso2_subscription_key = config.default_wso2_subscription_key
    var default_ckan_resource_id = config.default_ckan_resource_id
    var default_ckan_api_key = config.default_ckan_api_key
    res.render('home', {
        wso2_gateway_url: default_wso2_gateway_url,
        wso2_ckan_context: default_wso2_ckan_context,
        wso2_subscription_key: default_wso2_subscription_key,
        ckan_resource_id: default_ckan_resource_id,
        ckan_api_key: default_ckan_api_key
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

    // ===================================================
    // Construct url based on input
    // ===================================================
    // Strip leading/trailing slashes
    wso2_gateway_url = wso2_gateway_url.replace(/^\/|\/$/g, '')
    wso2_ckan_context = wso2_ckan_context.replace(/^\/|\/$/g, '')
    // Construct URL
    var wso2_request_url = wso2_gateway_url + '/' + wso2_ckan_context + '/action/datastore_search?id='+ckan_resource_id
    // Append optional search term
    if (search_term != '') {
        wso2_request_url = wso2_request_url + '&q=' + search_term
    }

    // ===================================================
    // Invoke API
    // ===================================================
    res.render('home', {
        wso2_gateway_url: wso2_gateway_url,
        wso2_ckan_context: wso2_ckan_context,
        wso2_subscription_key: wso2_subscription_key,
        ckan_resource_id: ckan_resource_id,
        ckan_api_key: ckan_api_key,
        search_term: search_term,
        wso2_request_url: wso2_request_url
    })
})

module.exports = router
