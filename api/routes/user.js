const auth = require('../auth'),
    basicAuth = require('basic-auth'),
    models = require('../models/all'),
    User = models.User,
    SECRET = require('../config').SECRET,
    jwt = require('jsonwebtoken'),
    db = require('../config').db;

module.exports = function (router) {
    router.route('/user')
        .all(function (request, response, next) {
            // only authenticate on DELETE PUT and GET
            if (request.method === 'DELETE' || request.method === 'PUT' || request.method === 'GET') {
                auth.validateJWT(request, response, next);
            } else {
                next(); // if no token required continue
            }
        })
        .get(function (request, response) { // get user data
            var email = request.query.email;
            // find a single user
            User.findOne({
                where: {
                    email: email
                }
            })
            .then(function (user) {
                response.json(user);
            })
            .catch(function (error) {
                response.json(error);
            });
        })
        .post(function (request, response) { // registration
            console.log(request.body);
            // get sensitive credentials from basic authorization header
            var user = basicAuth(request);
            console.log(user);
            if (request.body.name && user && user.pass && user.name) {
                var name = request.body.name;
                var email = user.name;
                var password = user.pass;
                db.sync() // create table if it doesn't exists
                .then(function() {
                    return User.create({
                        name: name,
                        email: email,
                        password: password
                    });
                })
                .then(function(user) {
                    // create authentication token
                    jwt.sign({
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
                            // send token to user
                            response.json({
                                created: true,
                                token: token
                            });
                        }
                    });
                })
                .catch(function(error) { // catch any errors
                    response.json(error);
                });
            } else {
                response.json({
                    success: false,
                    message: 'All fields are required'
                });
            }
        })
        .put(function (request, response) {
            // unimplemented
        })
        .delete(function (request, response) {
            var email = email;
            // remove user from database
            User.destroy({
                where: {
                    email: email
                }
            })
            .then(function (result) {
                response.json(result);
                // TODO: remove all articles associated with user
            })
            .catch(function(error) {
                response.json(error);
            });
        });
};
