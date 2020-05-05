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
    console.log('Website live in ' + config.env +' environment at http://localhost:' + app.get('port') + config.baseUrl)
    console.log('Press Ctrl-C to terminate.')
})
// ===============================================
// Use 'body-parser' to enable reading of POST requests
// in req.body
// ===============================================
// npm i -S body-parser
app.use(require('body-parser').urlencoded({extended: true}))
// ===============================================
// Set up Handlebars view engine
// ===============================================
var express_handlebars = require('express-handlebars').create({ defaultLayout:'main' }) // npm i -S express-handlebars
// Use the handlebars as the view engine
app.engine('handlebars', express_handlebars.engine)
app.set('view engine', 'handlebars')
// ===============================================
// Define routes
// ===============================================
var appRouter = express.Router()
appRouter.get('/', function(req, res) {
    res.redirect(303, config.baseUrl + 'home')
})
var homepage = require('./routes/homepage')
appRouter.use('/home', homepage)
// Specify the base URL for the application
app.use(config.baseUrl, appRouter)
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
