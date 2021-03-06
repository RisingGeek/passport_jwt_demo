const User = require('../models/Users');
const Token = require('../models/Tokens');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

userHelper = {
    getUserByEmail: email => {
        return new Promise((resolve, reject) => {
            User.findOne({email}).then(res => {
                if(res) {
                    resolve(res);
                }
                else {
                    reject({message: "No such user"});
                }   
            }).catch(err => {

            });
        });
    },
    getUserById: id => {
        return new Promise((resolve, reject) => {
            User.findOne({_id: id}).then(res => {
                if(res) {
                    resolve(res);
                }   
                else {
                    reject({message: "No such user"});
                }
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
    generateToken: (id, email, headers) => {
        return new Promise((resolve, reject) => {
            new Token({
                _userId: id, 
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
                    to: email,
                    subject: 'Confirm account',
                    html: `
                    <p>Hello,</p>
                    <p>Please click on the following link to confirm your account:</p>
                    <a href=http://${headers.host}/users/confirmation/${res.token}?id=${id}>http://${headers.host}/users/confirmation/${res.token}?id=${id}</a>
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
    },
    verifyToken: (token, id) => {
        return new Promise((resolve, reject) => {
            if(!require('mongodb').ObjectId.isValid(id)) {
                reject({message: "Invalid id"});
            }
            User.findOne({_id: id}, {verified: 1}).then(res => {
                if(!res) {
                    reject({message: "Wrong id"});
                }
                if(res && res.verified) {
                    resolve({message: "Email already verified"});
                }
                else {
                    Token.findOne({token}, {_userId: 1, createdAt: 1}).then(res => {
                        if(!res) {
                            reject({message: "Invalid token"});
                        }
                        if(Date.now() - res.createdAt < 1000*60*10) {
                            Promise.all([
                                Token.deleteOne({_userId: res._userId}),
                                User.updateOne({_id: res._userId}, {
                                    $set: {verified: true}
                                })
                            ]).then(values => {
                                console.log(values)
                                resolve({message: "Email verified"});
                            }).catch(err => {
                                console.log("error")
                                reject({message: err});
                            });
                        }
                        else {
                            reject({message: "Token expired"});
                        }
                    }).catch(err => {
                        reject({message: err});
                    });
                }
            });
        });  
    },
    forgetPassword: (email, headers) => {
        return new Promise((resolve, reject) => {
            userHelper.getUserByEmail(email).then(user => {
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
                        to: email,
                        subject: 'Forget Password',
                        html: `
                        <p>Hello,</p>
                        <p>Please click on the following link to reset your password:</p>
                        <a href=http://${headers.host}/users/reset-password/${res.token}?id=${user._id}>http://${headers.host}/users/reset-password/${res.token}?id=${user._id}</a>
                        `
                    }
            
                    transporter.sendMail(mailOptions, function(err, info) {
                        if(err) {
                            console.log(err);
                            reject({message: 'Some error occured. Email not sent.'})
                        }
                        else {
                            console.log('sent email', info.response);
                            resolve({message: 'Email sent for forgot password'});
                        }
                    });
                });
            }).catch(err => {
                console.log(err);
            })
        })
    },
    resetPassword: (token, password) => {
        return new Promise((resolve, reject) => {
            Token.findOne({token}, {_userId: 1, createdAt: 1}).then(res => {
                if(!res) {
                    reject({message: "Invalid token"});
                }
                if(Date.now() - res.createdAt < 1000*60*10) {
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        Promise.all([
                            Token.deleteOne({_userId: res._userId}),
                            User.updateOne({_id: res._userId}, {
                                $set: {password: hash}
                            })
                        ]).then(values => {
                            resolve({message: "Password reset successful"});
                        }).catch(err => {
                            reject({message: err});
                        });
                    });
                }
                else {
                    reject({message: "Token expired"});
                }
            }).catch(err => {
                reject({message: err});
            });
        });
    }
};

module.exports = userHelper;