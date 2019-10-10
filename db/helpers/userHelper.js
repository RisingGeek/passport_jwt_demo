const User = require('../models/Users');

module.exports = {
    getUserByName: username => {
        return new Promise((resolve, reject) => {
            User.findOne({username}).then(res => {
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