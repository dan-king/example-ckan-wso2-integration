var express = require('express')
var app = express()
var server = app.listen(3020, function () {
    console.log('Listening on port %s.', server.address().port)
    console.log('Website live at http://localhost:3020/')
    console.log('Press Ctrl-C to terminate.')
})
