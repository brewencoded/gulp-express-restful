const auth = require('../auth'),
    models = require('../models/all'),
    User = models.User,
    SECRET = require('../config').SECRET,
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    basicAuth = require('basic-auth');

module.exports = function (router) {
    router.route('/login')
        .get(function (request, response) {
            var user = basicAuth(request);
            if (user && user.pass && user.name) {
                var email = user.name;
                var password = user.pass;
                User.findOne({
                    where: {
                        email: email
                    }
                })
                .then(function (user) {
                    bcrypt.compare(password, user.password, function (error, isMatch) {
                        if (error) {
                            response.json(error);
                        } else {
                            if (isMatch) {
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
                            } else {
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
        .all(auth.validateJWT)
        .get(function (request, response) {
            response.json({
                token: request.headers.authorization.split(' ')[1]
            });
        });
};
