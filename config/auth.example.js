// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'githubAuth' : {
		'clientID' 	: 'GITHUB-CLIENT-ID', // your App ID
		'clientSecret' 	: 'GITHUB-CLIENT-SECRET', // your App Secret
		'callbackURL' 	: 'GITHUB-CALLBACK-URL'
	},

	'linkedInAuth' : {
		'consumerKey' 	: 'LINKEDIN-CONSUMER-KEY',
		'consumerSecret': 'LINKEDIN-CONSUMER-SECRET',
		'callbackURL' 	: 'LINKEDIN-CALLBACK-URL'
	}
};
