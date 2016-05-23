const auth = require('../auth'),
    models = require('../models/all'),
    Article = models.Article,
    db = require('../config').db;

module.exports = function (router) {
    router.route('/articles')
        .all(auth.validateJWT)
        .get(function (request, response) {
            var email = request.query.email;
            Article.findAll({
                where: {
                    email: email
                }
            })
            .then(function (articles) {
                response.json(articles);
            })
            .catch(function (error) {
                response.json(error);
            });
        });

    router.route('/article')
        .all(function (request, response, next) {
            if (request.method === 'DELETE' || request.method === 'PUT') {
                auth.validateJWT(request, response, next);
            } else {
                next();
            }
        })
        .get(function (request, response) {
            //
        })
        .put(function (request, response) {
            var slug = request.body.slug;
            var title = request.body.title;
            var body = request.body.body;
            if (title && body) {
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
                response.json({
                    success: false,
                    message: 'All fields are required'
                });
            }
        })
        .delete(function (request, response) {
            var slug = request.body.slug;
            if (slug) {
                db.sync()
                .then(function () {
                    Article.destroy({
                        where: {
                            slug: slug
                        }
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
                    message: 'All fields are required'
                });
            }
        })
        .post(function (request, response) {
            var title = request.body.title;
            var body = request.body.body;
            var email = request.body.email;

            if (title && email && body) {
                db.sync()
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
