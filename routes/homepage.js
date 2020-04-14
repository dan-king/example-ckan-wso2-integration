var express = require('express')
var router = express.Router()

// Show blank form
router.get('/', function(req, res){
    res.render('home')
})

// Process form values. Re-display form with selected values and results.
router.post('/datastore_search', function(req, res){
    res.render('home', {
    })
})

module.exports = router
