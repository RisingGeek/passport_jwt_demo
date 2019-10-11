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
    },
    checkPassword: user => {
        return new Promise((resolve, reject) => {
            User.findOne({email: user.email}).then(response => {
                if(response) {
                    bcrypt.compare(user.password, response.password, function(err, res) {
                        if(res) {
                            resolve(response);
                        }
                        else {
                            reject({message: "Incorrect password"});
                        }
                    });
                }
                else {
                    reject({message: "Email not found"});
                }
            });
            
        });
    }
};