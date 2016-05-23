const auth = require('../auth'),
    models = require('../models/all'),
    Article = models.Article,
    db = require('../config').db;

/**
* All routes relating to articles
**/
module.exports = function (router) {
    router.route('/articles')
        .all(auth.validateJWT) // validates token before logic below is run
        .get(function (request, response) { // if token is valid return all articles
            var email = request.query.email;
            // query database
            Article.findAll({
                where: {
                    email: email
                }
            })
            .then(function (articles) { // once query is done return results
                // respond in json format
                response.json(articles);
            })
            .catch(function (error) { // catch any errors and tell client
                response.json(error);
            });
        });

    router.route('/article')
        .all(function (request, response, next) {
            if (request.method === 'DELETE' || request.method === 'PUT') { // only validate for DELETE and PUT methods
                auth.validateJWT(request, response, next);
            } else {
                next(); // if no token is required just continue to logic
            }
        })
        .get(function (request, response) {
            // unimplemented
        })
        .put(function (request, response) {
            var slug = request.body.slug;
            var title = request.body.title;
            var body = request.body.body;
            if (title && body) {
                // update in database
                Article.update({
                    slug: title.replace(/\s/g, '-'),
                    title: title,
                    body: body
                },
                {
                    where: {
                        slug: slug
                    }
                })
                .then(function (affected) {
                    // respond in json format returning affected rows and show updates
                    response.json({
                        affected: affected,
                        updates: {
                            slug: title.replace(/\s/g, '-'),
                            title: title,
                            body: body
                        }
                    });
                })
                .catch(function (error) {
                    response.json(error);
                });
            } else {
                // If a field was empty return error message
                response.json({
                    success: false,
                    message: 'All fields are required'
                });
            }
        })
        .delete(function (request, response) { // delete from database
            var slug = request.body.slug;
            if (slug) {
                Article.destroy({
                    where: {
                        slug: slug
                    }
                })
                .then(function (article) {
                    response.json(article);
                })
                .catch(function (error) {
                    response.json(error);
                });
            } else {
                response.json({
                    success: false,
                    message: 'All fields are required'
                });
            }
        })
        .post(function (request, response) {
            var title = request.body.title;
            var body = request.body.body;
            var email = request.body.email;

            if (title && email && body) {
                db.sync() // create table if it does not already exist
                .then(function () {
                    var slug = title.replace(/\s/g, '-');
                    return Article.create({
                        slug: slug,
                        title: title,
                        body: body,
                        email: email
                    });
                })
                .then(function (article) {
                    response.json(article);
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
};
