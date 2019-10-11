const User = require('../models/Users');

module.exports = {
    getUserByEmail: email => {
        return new Promise((resolve, reject) => {
            User.findOne({email}).then(res => {
                resolve(res);   
            });
        });
    },
    getUserById: id => {
        return new Promise((resolve, reject) => {
            User.findOne({_id: id}).then(res => {
                resolve(res);   
            });
        });
    }
};