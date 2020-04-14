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
    res.render('home', {
    })
})

module.exports = router
