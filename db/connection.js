const mongoose = require('mongoose');
const assert = require('assert')

mongoose.connect('mongodb://localhost:27017/passport_jwt_demo', 
{ useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
    assert.equal(null, err);
    console.log('connected to database');
});