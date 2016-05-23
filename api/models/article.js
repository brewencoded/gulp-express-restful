var Sequelize = require('sequelize');
var db = require('../config').db;

// Article object maps to an articles table
var Article = db.define('article', {
    slug: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: { // query will not complete if this fails
            len: {
                args: [10, 150],
                msg: 'Title must be between 10 and 150 characters.'
            }
        }
    },
    body: {
        type: Sequelize.STRING
    }
}, {
    timestamps: true // tracks when user was created and modified
});

module.exports = Article;
