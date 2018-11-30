const express = require('express');

const app express();

const path = require('path');

const mongoose = require('mongoose');

const passport = require('passport');

const flash = require('connect-flash');

const morgan = require('morgan');

const cookieParser = require('cokie-parser');

const bodyParser = require('body-parser');

const session = require('express-session');

const { url } = require('./config/database');




//settings

mongoose.connect(url, {

	useMongoClient: true

});

app.set('port', process.env.PORT || 3000) //este es la conexion del puerto 

app.set('views',path.join(_dirname,'views'));

app.set('view engine','ejs');




//middlewares 

app.use(morgan('dev'));

app.use(cokieParser());

app.use(bodyParser.urlencoded({extended: false}));

app.use(session({

	secret: 'teamomiamornichols', //palabra secreta

	resave: false,

	saveUninitialized: false

}));

app.use(passport.initialize);

app.use(passport.session());

app.use(flash());





//routes

require('./app/routes')(app,passport);





//static files

app.listen(app.get('port'), () => {

console.log('server on port', app.get('port'));

});

app.use(express.static(path.join(_dirname,'public')));

//require('./config/passport')(passport);

