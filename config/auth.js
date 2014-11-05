// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'githubAuth' : {
		'clientID' 		: '21c94baeae846cc9f331', // your App ID
		'clientSecret' 	: '5e51de048cc8be396bcd7a2b556d54b1c47d7dde', // your App Secret
		'callbackURL' 	: 'http://127.0.0.1:3000/auth/github/callback'
	},

	'linkedInAuth' : {
		'consumerKey' 		: '750b5ekwn8c5pz',
		'consumerSecret' 	: '7qoeyAxyw4GYG22O',
		'callbackURL' 		: 'http://127.0.0.1:3000/auth/linkedin/callback'
	}
};