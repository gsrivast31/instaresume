// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var LinkedInStrategy  = require('passport-linkedin-oauth2').Strategy;
var GitHubStrategy = require('passport-github').Strategy;

// load up the user model
var User       = require('../app/models/user').user;

// load the auth variables
var configAuth = require('./auth');

function getEmployment(employment) {
	var job = new Object();
	job.company = employment.company.name;
	job.role = employment.hasOwnProperty('title') ? employment.title : '';

	if (employment.hasOwnProperty('startDate')) {
		var startDate = employment.startDate;
		job.year_from = startDate.hasOwnProperty('year') ? startDate.year : '';
		job.month_from = startDate.hasOwnProperty('month') ? startDate.month : '';
	} else {
		job.year_from = '';
		job.month_from = '';
	}

	if (employment.hasOwnProperty('endDate')) {
		var endDate = employment.endDate;
		job.year_to = endDate.hasOwnProperty('year') ? endDate.year : '';
		job.month_to = endDate.hasOwnProperty('month') ? endDate.month : '';
	} else {
		job.year_to = '';
		job.month_to = '';
	}

	return job;
}

function getEducation(education) {
	var school = new Object();
	school.schoolName = education.hasOwnProperty('schoolName') ? education.schoolName : '';
	school.degree = education.hasOwnProperty('degree') ? education.degree : '';
	school.field = education.hasOwnProperty('fieldOfStudy') ? education.fieldOfStudy : '';

	if (education.hasOwnProperty('startDate')) {
		var startDate = education.startDate;
		school.year_from = startDate.hasOwnProperty('year') ? startDate.year : '';
		school.month_from = startDate.hasOwnProperty('month') ? startDate.month : '';
	} else {
		school.year_from = '';
		school.month_from = '';
	}

	if (education.hasOwnProperty('endDate')) {
		var endDate = education.endDate;
		school.year_to = endDate.hasOwnProperty('year') ? endDate.year : '';
		school.month_to = endDate.hasOwnProperty('month') ? endDate.month : '';
	} else {
		school.year_to = '';
		school.month_to = '';
	}

	return school;
}

module.exports = function(passport) {

	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
	// code for login (use('local-login', new LocalStategy))
	// code for signup (use('local-signup', new LocalStategy))
	// code for facebook (use('facebook', new FacebookStrategy))
	// code for twitter (use('twitter', new TwitterStrategy))

	// LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
	    },
	    function(req, email, password, done) {

	    	console.log(req);
	    	console.log(email);
	    	console.log(password);

	        // asynchronous
	        // User.findOne wont fire unless data is sent back
	        process.nextTick(function() {

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
	        User.findOne({ 'local.email' :  email }, function(err, user) {
	            // if there are any errors, return the error
	            if (err)
	                return done(err);

	            // check to see if theres already a user with that email
	            if (user) {
	                return done(null, false, req.flash('errorMessage', 'That email is already taken.'));
	            } else {

					// if there is no user with that email
	                // create the user
	                var newUser            = new User();

	                // set the user's local credentials
	                newUser.email    = email;
	                newUser.local.password = newUser.generateHash(password);

					// save the user
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, newUser);
	                });
	            }
	        });    
        });
    }));

	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('errorMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('errorMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));


	// =========================================================================
    // GITHUB ==================================================================
    // =========================================================================
    passport.use(new GitHubStrategy({
    	clientID        : configAuth.githubAuth.clientID,
        clientSecret    : configAuth.githubAuth.clientSecret,
        callbackURL     : configAuth.githubAuth.callbackURL,
        scope: ['repo', 'user']
    	},
    	function(accessToken, refreshToken, profile, done) {

			// make the code asynchronous
			// User.findOne won't fire until we have all our data back from Google
			process.nextTick(function() {

		        // try to find the user based on their google id
		        User.findOne({ 'github.id' : profile.id }, function(err, user) {
		            if (err)
		                return done(err);

		            console.log(profile);
		            if (user) {

		                // if a user is found, log them in
		                return done(null, user);
		            } 
		            else {
		                // if the user isnt in our database, create a new user
		                var newUser          = new User();

		                // set all of the relevant information
		                newUser.github.id    = profile.id;
		                newUser.github.token = accessToken;
		                
		                // save the user
		                newUser.save(function(err) {
		                    if (err)
		                        throw err;
		                    return done(null, newUser);
		                });
		        	}
		    	});
	    	});
		}
    ));

	passport.use(new LinkedInStrategy({
        clientID: configAuth.linkedInAuth.consumerKey,
        clientSecret: configAuth.linkedInAuth.consumerSecret,
        callbackURL: configAuth.linkedInAuth.callbackURL,
        scope: ['r_emailaddress', 'r_fullprofile', 'r_contactinfo'],
        }, 
        function(accessToken, refreshToken, profile, done) {

        	// asynchronous verification, for effect...
            process.nextTick(function () {
		        // try to find the user based on their google id
		        User.findOne({ 'linkedin.id' : profile.id }, function(err, user) {
		            if (err)
		                return done(err);

		            if (user) {
		                // if a user is found, log them in
		                return done(null, user);
		            } 
		            else {
		                // if the user isnt in our database, create a new user
		                var newUser          = new User();

		                // set all of the relevant information
		                newUser.linkedin.id    = profile.id;
		                newUser.linkedin.token = accessToken;
		                newUser.name  		   = profile.displayName;
		                newUser.email 		   = profile.emails[0].value; // pull the first email

		                var _json 			   = profile._json;

		                newUser.bio            = _json.hasOwnProperty('summary') ?  _json.summary : '';
						newUser.dob 		   = _json.hasOwnProperty('dateOfBirth') ?  _json.dateOfBirth : {};	
						newUser.linkedin_url   = _json.hasOwnProperty('publicProfileUrl') ? _json.publicProfileUrl : '';

						newUser.education      = [];
						var educations = _json.educations.values;
		                for (var pos in educations) {
		                	var education = getEducation(educations[pos]);
		                	newUser.education.push(education);
		                }

		                newUser.employment      = [];
		                var employments = _json.positions.values;
		                for (var position in employments) {
		                	newUser.employment.push(getEmployment(employments[position]));
		                }

		                newUser.skills 			= [];
		                var skills = profile._json.skills.values;
		                for (var pos in skills) {
		                	newUser.skills.push(skills[pos].skill.name);
		                }
					    // save the user
		                newUser.save(function(err) {
		                    if (err)
		                        throw err;
		                    return done(null, newUser);
		                });
		        	}            
		        });
		    });
       	}
    ));
};