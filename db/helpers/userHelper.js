const User = require('../models/Users');
const bcrypt = require('bcrypt');

module.exports = {
    getUserByEmail: email => {
        return new Promise((resolve, reject) => {
            User.findOne({email}).then(res => {
                resolve(res);   
            }).catch(err => {

            });
        });
    },
    getUserById: id => {
        return new Promise((resolve, reject) => {
            User.findOne({_id: id}).then(res => {
                resolve(res);   
            }).catch(err => {

            });
        });
    },
    addUser: user => {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            User.findOne({email: user.email}).then(res => {
                if(res) {
                    reject("Email already registered");
                }
                bcrypt.hash(user.password, saltRounds, function(err, hash) {
                    new User({email: user.email, password: hash}).save().then(res => {
                        resolve(res);
                    });
                });
            });
        });
    }
    // verifyPassword: plain_password => {
    //     return new Promise((resolve, reject) => {
    //         const saltRounds = 10;
    //     });
    // }
};