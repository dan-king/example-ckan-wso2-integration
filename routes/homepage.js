var express = require('express')
var router = express.Router()

// Homepage
router.get('/', function(req, res){
    return res.send({"message":"Hello World via router!"})
})

module.exports = router
