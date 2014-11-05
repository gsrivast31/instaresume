// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        password     : String
    },
    github           : {
        id           : String,
        token        : String,
    },
    linkedin         : {
        id           : String,
        token        : String,
    },
    email            : String,
    name             : String,
    bio              : String,
    dob              : Object,
    phone            : String,
    address          : String,
    website          : String,
    twitter_url      : String,
    facebook_url     : String,
    github_url       : String,
    linkedin_url     : String,
    
    employment       : [],

    education        : [],

    skills           : [String],

    projects         : [],    

    awards           : []
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports.user = mongoose.model('User', userSchema);

