module.exports = (app, passport) => {

	app.get('/',(req,res) => {

		res.render('index');

	});

	

	app.get('/login',(req,res) => {

		res.render('login',{

			message: req.flash('loginMessage')

		});

	});
	
	
	app.post('/login', passport.authenticate('local-login', {

		successRedirect: '/profile',

		failureRedirect: '/login',

		failureFlash: true

	}));



	// signup view

	app.get('/signup', (req, res) => {

		res.render('signup', {

			message: req.flash('signupMessage')

		});

	});



	app.post('/signup', passport.authenticate('local-signup', {

		successRedirect: '/profile',

		failureRedirect: '/signup',

		failureFlash: true // allow flash messages

	}));

};

