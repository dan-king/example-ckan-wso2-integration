var express = require('express')
var config = require('./config.json') // See config.template.json for sample config file
var app = express()
app.set('port', config.port || 3000)
app.set('env', config.env || 'development')
// Allow self-signed certs in development
if (app.get('env') == 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}
var server = app.listen(app.get('port'), function () {
    console.log('Listening on port %s.', server.address().port)
    console.log('Website live in ' + config.env +' environment at http://localhost:' + app.get('port') + '/')
    console.log('Press Ctrl-C to terminate.')
})

app.get('/', function(req, res) {
    return res.send('Hello World!')
})