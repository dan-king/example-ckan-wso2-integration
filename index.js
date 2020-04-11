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
// ===============================================
// Define routes
// ===============================================
// Home
app.get('/', function(req, res){
    res.redirect(303, '/home')
})
var homepage = require('./routes/homepage')
app.use('/home', homepage)
// ------------------------
// Special routes if page not found or an error occurred
// ------------------------
// Error page
app.get('/error', function(req, res){
    var err = req.query.err
    res.render('error', {
        err: err
    })
})
// Custom 404 page
app.use(function(req, res){
    res.status(404)
    res.render('404')
})
// Custom 500 page
app.use(function(err, req, res){
    console.error(err.stack)
    res.status(500)
    res.render('500')
})
