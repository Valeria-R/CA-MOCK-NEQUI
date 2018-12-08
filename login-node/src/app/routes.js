const User = require('./models/user');

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

  app.post('/test', (req,res) =>{
		console.log("Si sirvo para algo.");
	})

	//añadir dinero
app.post('/addMoney', isLoggedIn, (req,res) =>{
	console.log(req.body.userId);
	User.findById({_id: req.body.userId}, function(err,user){
		if(err){
			console.log("Entre");
			res.status(500).send()
		}
		console.log(user);
		user.account.saldoTotal = user.account.saldoTotal + parseInt(req.body.money)

		user.account.saldoDisponible = user.account.saldoDisponible + parseInt(req.body.money)
		user.save()
	})
})

//remover dinero
app.post("/removeMoney", isLoggedIn, (req,res) => {
	User.findById({_id: req.body.userId}, function(err,user){
		user.account.saldoTotal = user.account.saldoTotal - parseInt(req.body.money)

		user.account.saldoDisponible = user.account.saldoDisponible - parseInt(req.body.money)
		user.save()
	})
})

//añadir dinero al colchon
app.post("/addMattress", isLoggedIn, (req,res) => {
	User.findById({_id: req.body.userId}, function(err,user){
		if(err){
			res.status(500).send()
		}
		user.account.mattress = user.account.mattress + parseInt(req.body.mattressMoney);
		user.account.saldoDisponible = user.account.saldoDisponible - parseInt(req.body.mattressMoney);
		user.save()
	})
})

//devolver plata del colchon al saldo
app.post("/removeMattress", isLoggedIn, (req,res) => {
    User.findById({_id: req.body.userId}, function(err,user){
			if(err){
				res.status(500).send()
			}
        user.account.saldoDisponible = user.account.saldoDisponible + parseInt(req.body.mattressAccount)
        user.account.mattress = user.account.mattress - parseInt(req.body.mattressAccount)
        user.save()
    })
})

//crear bolsillo
app.post("/createPocket", isLoggedIn, (req,res) => {
	User.findById({_id: req.body.userId}, function(err,user){
		if(err){
			res.status(500).send()
		}
		user.account.pockets.push({
			pocketName: req.body.pocketName,
			pocketSaldo: 0
		})
		user.save()
	})
})

	//añadir saldo al bolsillo
app.get("/moneyToPocket/:userId/:pocketId", isLoggedIn, (req,res) => {
	User.findById(req.user._id, function(err,user){
		var pocket = user.account.pockets.id(req.params.pocketId)
		res.render('addPocket',{
			user:req.user,
			pocket:pocket
		})
	})
})

//añadir dinero al bolsillo
app.post("/addPocketMoney", isLoggedIn, (req,res) => {
	User.findById({_id: req.user._id}, function(err,user){
		if(err){
			res.status(500).send()
		}
		var monto = parseInt(req.body.pocketSaldo)
		user.account.pockets.id(req.body.pocketId).pocketSaldo += monto,
		user.account.saldoDisponible -= monto
		user.save()
		res.redirect("/pockets")
	})
})

app.get("/retirarSaldo/:userId/:pocketId", isLoggedIn, (req,res) => {
	User.findById(req.user._id, function(err,user){
		var pocket = user.account.pockets.id(req.params.pocketId)
		res.render('removePocketMoney',{
			user:req.user,
			pocket:pocket
		})
	})
})

//retirar dinero del bolsillo
app.post("/removePocket", isLoggedIn, (req,res) => {
	User.findById({_id: req.user._id}, function(err,user){
		if(err){
			res.status(500).send()
		}
		var monto = parseInt(req.body.pocketSaldo)
		user.account.pockets.id(req.body.pocketId).pocketSaldo -= monto,
		user.account.saldoTotal -= monto

		user.save()
	})
})


//eliminar bolsillo
app.get("/deletePocket/:userId/:pocketId", isLoggedIn, (req,res) => {
	User.findById(req.user._id, function(err,user){
		var pockets = user.account.pockets
		for(var i = 0; i < pockets.length; i++ ){
			if(pockets[i]._id == req.params.pocketId){
				user.account.saldoDisponible += pockets[i].pocketSaldo
			}
		}
		user.account.pockets.id(req.params.pocketId).remove()
		user.save()
	})
})

//añadir una meta
app.post("/addGoal", isLoggedIn, (req,res) => {
	User.findById({_id: req.body.userId}, function(err,user){
		if(err){
			res.status(500).send()
		}
		user.account.goals.push({
			goalName: req.body.goalName,
			montoTotal: req.body.goalTotal,
			dineroAhorrado: 0,
			dineroRestante: req.body.goalTotal,
			estado: "Sin completar",
			fechaLimite: req.body.goalDate
		})
		user.save()
	})
})

//añadir dinero a la meta
app.get("/moneyToGoal/:userId/:idGoal", isLoggedIn, (req,res) => {
	User.findById(req.user._id, function(err,user){
		var goal = user.account.goals.id(req.params.idGoal)
		res.render('addMoneyToGoal',{
			user:req.user,
			goal:goal
		})
	})
})

app.post("/addGoalMoney", isLoggedIn, (req,res) => {
	console.log(req.body);
	User.findById({_id: req.body.userId}, function(err,user){
		if(err){
			res.status(500).send()
		}
		var monto = parseInt(req.body.goalMoney)
		console.log(monto);
		user.account.goals.id(req.body.idGoal).dineroAhorrado += monto,
		user.account.goals.id(req.body.idGoal).dineroRestante -= monto,
		user.account.saldoDisponible -= monto
    if (user.account.goals.id(req.body.idGoal).dineroAhorrado >= user.account.goals.id(req.body.idGoal).montoTotal) {
			user.account.goals.id(req.body.idGoal).estado = "Completado"
    }
		user.save()
	})
})

app.get('/account', isLoggedIn, (req,res) => {
	res.render('account',{
        user: req.user
  })
})

app.get('/mattress', isLoggedIn, (req,res) => {
	res.render('mattress',{
        user: req.user
  })
})

app.get('/pockets', isLoggedIn, (req,res) => {
 res.render('pockets',{
	 			user: req.user
 })
})

app.get("/goals", (req,res) => {
	res.render('goals',{
 	 			user: req.user
  })
})

};

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}
