var SECRET = require('./config').SECRET;
var jwt = require('jsonwebtoken');
/**
* Token Validation
**/
module.exports = {
    validateJWT: function (request, response, next) {
        // gets authorization headers
        var authorization = request.headers.authorization;
        // an email must be passed with all requests to compare to token payload
        var userEmail = request.query.email || request.body.email;

        if (authorization && userEmail) { // required
            var token = authorization.split(' ')[1]; // get the token
            jwt.verify(token, SECRET, function (err, decoded) {
                if (err) {
                    response.json({
                        success: false,
                        message: 'Failed to authenticate token',
                        error: err
                    });
                } else {
                    // compare user submitted email to decoded email. in case a token is stolen or forged.
                    if (userEmail.toString().trim() !== decoded.email.toString().trim()) {
                        response.json({
                            success: false,
                            message: 'You do not have access to this user.'
                        });
                    } else {
                        request.decoded = decoded;
                        next();
                    }
                }
            });
        } else {
            response.json({
                success: false,
                message: 'Failed to authenticate token'
            });
        }
    }
};
