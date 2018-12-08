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

	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup',{
    failureRedirect: '/signup',
    successRedirect:'/profile',
    failureFlash: true
  }));

	app.get('/profile', isLoggedIn, (req,res) => {
    res.render('profile',{
        user:req.user
    });
	});

	app.get('/logout',(req,res) =>{
	    req.logout();
	    res.redirect('/')
	});


	//añadir dinero
app.post("/addMoney", isLoggedIn, (res,req) =>{
	user.findById({_id: req.body.userId}, function(user,err){
		if(err){
			res.status(500).send()
		}
		user.account.saldoTotal = user.account.saldoTotal + parseInt(req.body.money)

		user.account.saldoDisponible = user.account.saldoDisponible + parseInt(req.body.money)
		user.save()
		res.redirect('/profile')
	})
})

//remover dinero
app.post("/removeMoney", isLoggedIn, (res, req) => {
	user.findById({_id: req.body.userId}, function(user,err){
		user.account.saldoTotal = user.account.saldoTotal - parseInt(req.body.money)

		user.account.saldoDisponible = user.account.saldoDisponible - parseInt(req.body.money)
		user.save()
		res.redirect('/profile')
	})
})

//añadir dinero al colchon
app.post("/addMattress", isLoggedIn, (res,req) => {
	user.findById({_id: req.body.userId}, function(user,err){
		if(err){
			res.status(500).send()
		}
		user.account.mattress = user.account.mattress + parseInt(req.body.mattressMoney);
		user.save()
		res.redurect('/profile')
	})
})


//crear bolsillo
app.post("/addPocket", isLoggedIn, (res,req) => {
	user.findById({_id: req.body.userId}, function(user, err){
		if(err){
			res.status(500).send()
		}
		user.account.pockets.push({
			pocketName: req.body.pocketName,
			pocketSaldo: 0
		})
		user.save()
		res.redirect('/profile')
	})
})

//añadir dinero al bolsillo
app.post("/addPocketMoney", isLoggedIn, (res,req) => {
	user.findById({_id: req.body.userId}, function(user, err){
		if(err){
			res.status(500).send()
		}
		var monto = parseInt(req.body.pocketMoney)
		user.account.pockets.id(req.body.idPocket).pocketSaldo += monto,
		user.account.saldoDisponible -= monto

		user.save()
		res.redirect('/profile')
	})
})

//retirar dinero del bolsillo
app.post("/removePocket", isLoggedIn, (res,req) => {
	user.findById({_id: req.body.userId}, function(user, err){

		var monto = parseInt(req.body.pocketMoney)
		user.account.pockets.id(req.body.idPocket).pocketSaldo -= monto,
		user.account.saldoDisponible -= monto,
		user.account.saldoTotal -= monto

		user.save()
		res.redirect('/profile')
	})
})

//eliminar bolsillo
app.post("/deletePocket", isLoggedIn, (res,req) => {
	user.findById({_id: req.body.userId}, function(user, err){
		var pockets = user.account.pockets
		for(var i = 0; i < pockets.length; i++ ){
			if(pockets[i] == req.body.pockedId){
				user.account.saldoTotal += pockets[i].pocketSaldo
			}
		}
		user.account.pockets.id(req.body.pocketId).remove()
		user.save()
		res.redirect('/profile')
	})
})



//añadir una meta
app.post("/addGoal", isLoggedIn, (res,req) => {
	user.findById({_id: req.body.userId}, function(user,err){
		if(err){
			res.status(500).send()
		}
		user.account.goals.push({
			goalName: req.body.goalName,
			montoTotal: req.body.goalTotal,
			dineroAhorrado: 0,
			dineroRestante: req.body.goalTotal,
			estado: false,
			fechaLimite: req.body.goalDate
		})
		user.save()
		res.redirect('/profile')
	})
})


//añadir dinero a la meta
app.post("/addGoalMoney", isLoggedIn, (res,req) => {
	user.findById({_id: req.body.userId}, function(user,err){
		if(err){
			res.status(500).send()
		}
		var monto = parseInt(req.body.goalMoney)
		user.account.goals.id(req.body.idGoal).dineroAhorrado += amount,
		user.account.goals.id(req.boy.idGoal).montoTotal -= amount,
		user.account.saldoDisponible -= amount
		user.save()
		res.redirect('/profile')
	})
})

app.get("/mattress", (req,res) => {
	res.render('mattress')
})

app.get("/pockets", (req,res) => {
 res.render("pockets")
})

app.get("/goals", (req,res) => {
 res.render("goals")
})

};

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}
