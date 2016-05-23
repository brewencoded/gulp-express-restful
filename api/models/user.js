var Sequelize = require('sequelize');
var db = require('../config').db;
var bcrypt = require('bcrypt');

// User object maps to an users table
var User = db.define('user', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: true
});

// takes the text password and converts it to a one-way hashed text string
User.hook('afterValidate', function(user) {
    user.password = bcrypt.hashSync(user.password, 8);
});

module.exports = User;
