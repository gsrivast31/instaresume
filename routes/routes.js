// app/routes.js
module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('home', { message : req.flash('errorMessage')}); // load the index.ejs file
  });

  // GITHUB ROUTES =======================
  app.get('/auth/github', passport.authenticate('github'));
  // the callback after google has authenticated the user
  app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect : '/resume', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));


  // LINKEDIN ROUTES =======================
  app.get('/auth/linkedin', passport.authenticate('linkedin', { 
    state: 'instaresume'
  }));
  // the callback after google has authenticated the user
  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect : '/resume', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // process the signup form
  // app.post('/signup', do all our passport stuff here);

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)

  app.get('/resume', isLoggedIn, function(req, res) {
    res.render('resume', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/resume', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/resume', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.post('/submitResume', function(req, res) {
    console.log(req.body);
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
