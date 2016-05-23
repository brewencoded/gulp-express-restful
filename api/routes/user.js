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
            if (request.method === 'DELETE' || request.method === 'PUT' || request.method === 'GET') {
                auth.validateJWT(request, response, next);
            } else {
                next();
            }
        })
        .get(function (request, response) {
            var email = request.query.email;
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
        .post(function (request, response) {
            console.log(request.body);
            var user = basicAuth(request);
            console.log(user);
            if (request.body.name && user && user.pass && user.name) {
                var name = request.body.name;
                var email = user.name;
                var password = user.pass;
                db.sync()
                .then(function() {
                    return User.create({
                        name: name,
                        email: email,
                        password: password
                    });
                })
                .then(function(user) {
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
                            response.json({
                                created: true,
                                token: token
                            });
                        }
                    });
                })
                .catch(function(error) {
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
            User.destroy({
                where: {
                    email: email
                }
            })
            .then(function (result) {
                response.json(result);
            })
            .catch(function(error) {
                response.json(error);
            });
        });
};
