const auth = require('../auth'),
    models = require('../models/all'),
    User = models.User,
    SECRET = require('../config').SECRET,
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    basicAuth = require('basic-auth');

/**
* All routes relating to authentication
**/
module.exports = function (router) {
    router.route('/login')
        .get(function (request, response) {
            // grab variables from basic authorization header
            var user = basicAuth(request);
            if (user && user.pass && user.name) {
                var email = user.name;
                var password = user.pass;
                // Search for a single result in the database
                User.findOne({
                    where: {
                        email: email
                    }
                })
                .then(function (user) {
                    // encrypt password using the same hash and salt and compare it to the database password
                    bcrypt.compare(password, user.password, function (error, isMatch) {
                        if (error) {
                            response.json(error);
                        } else {
                            if (isMatch) {
                                jwt.sign({ // create json web token
                                    email: user.email
                                },
                                SECRET,
                                {
                                    expiresIn: '7d' // expires in a week
                                },
                                function (err, token) {
                                    if (err) {
                                        response.json({
                                            error: err
                                        });
                                    } else {
                                        response.json({
                                            created: true,
                                            token: token // send token to user
                                        });
                                    }
                                });
                            } else { // invalid credentials
                                response.json({
                                    validUser: false,
                                    message: 'The supplied email and password combination does not match.'
                                });
                            }
                        }
                    });
                })
                .catch(function (error) {
                    response.json(error);
                });
            } else {
                response.json({
                    success: false,
                    message: 'All fields are required.'
                });
            }
        });

    router.route('/token')
        .all(auth.validateJWT) // check if token is still valid
        .get(function (request, response) {
            // return token if it is still valid
            response.json({
                token: request.headers.authorization.split(' ')[1]
            });
        });
};
