/**
* variables and imports
**/
const express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    path = require('path'),
    morgan = require('morgan'),
    config = require('./config');

// routes
const article = require('./api/routes/article')(router),
    user = require('./api/routes/user')(router),
    authenticate = require('./api/routes/authenticate')(router);

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.PORT;

// define the express application
const app = express();

/**
* middleware
**/

// allows access to post values via request.body
// https://github.com/expressjs/body-parser
app.use(bodyParser.urlencoded({ extended: false }));
// logs requests and responses to the console
// https://github.com/expressjs/morgan
app.use(morgan('dev'));

/**
* serve content
**/

// api routes
app.use('/api/v1', router);
// serve static content
const staticPath = path.join(__dirname, config.STATIC); // gets absolute path to file
app.use(staticPath, express.static('./static'));
// all other routes not specified will be handled by front-end routing (Single-page applications)
app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/static/index.html'));
});


const server = app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('\nListening at http://localhost:' + config.PORT + '\n');
});

module.exports = server;
