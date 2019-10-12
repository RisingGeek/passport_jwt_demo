const User = require('../models/Users');
const Token = require('../models/Tokens');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
    },
    generateToken: (user, headers) => {
        return new Promise((resolve, reject) => {
            new Token({
                _userId: user._id, 
                token: crypto.randomBytes(16).toString('hex')
            }).save().then(res => {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PASS
                    }
                });
                let mailOptions = {
                    from: 'bhavaypuri15@gmail.com',
                    to: 'bhavaypuri15@gmail.com',
                    subject: 'Confirm account',
                    html: `
                    <p>Hello,</p>
                    <p>Please click on the following link to confirm your account:</p>
                    <a href=http://${headers.host}/users/confirmation/${res.token}>http://${headers.host}/users/confirmation/${res.token}</a>
                    `
                }

                transporter.sendMail(mailOptions, function(err, info) {
                    if(err) {
                        console.log(err);
                        reject({message: 'Some error occured. Email not sent.'})
                    }
                    else {
                        console.log('sent email', info.response);
                        resolve({message: 'Email sent'});
                    }
                });
            })
        });
    }
};