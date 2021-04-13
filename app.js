if (process.env.NODE_ENV !== 'production') { //When we are not in production or deploy the app to the site, then we can go to dotenv or .env to configure.
	require('dotenv').config();
}

const express = require('express');//enabling express  
const app = express();//creating an app route using express 
const path = require('path');//enabling path
const mongoose = require('mongoose');//enabling mongoose
const methodOverride = require('method-override');//enabling method-override
const ejsMate = require('ejs-mate');//enabling ejs-mate
const AppError = require('./utilities/AppError');//enabling and grabbing the AppError 
const companyRoutes = require('./routes/companies');//enabling and importing companyroutes from companies.js
const reviewRoutes = require('./routes/reviews');//enabling and importing reviewroutes from reviews.js
const session = require('express-session');//enabling express-session
const flash =  require('connect-flash');//enabling connect-flash
const passport = require('passport');//enabling passport
const PassportLocal = require('passport-local');//enabling PassportLocal 
const User = require('./models/user');//enabling importing our object oriented model User from user.js
const authRoute = require('./routes/users');//enabling importing our users route from users.js
const MongoStore = require('connect-mongo');//enabling our connect-mongo
const url = process.env.DB_STRING || 'mongodb://localhost:27017/companyCapstone'

//mongodb+srv://Co:<Azureexpressnode_js0>@mycapstonedev.bygoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//'mongodb://localhost:27017/companyCapstone'
//process.env.DB_STRING

//----------------------------------------------------------------//
//Mongoose Connecting to Mongo
mongoose.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('Mongo Connection Established');
	})
	.catch((error) => handleError(error));
//---------------------------------------------------------------//

//Setting up EJS and its pathing
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//Setting up EJS-Mate
app.engine("ejs", ejsMate);

//Parsing your form body
app.use(express.urlencoded({extended: true}));//checking to see if it is a form

//Parsing the override method
app.use(methodOverride("_method")); //checking what method to use _method=DELETE,PUT,..... in <form action ="...">

// Making public folder available
app.use(express.static('public'));//Styling in CSS
app.use(express.static(path.join(__dirname, '/public')));//Accessing to CSS file

const secret = process.env.SECRET || 'drake'

const store = MongoStore.create({
	mongoUrl: url,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret,
	},
});

// This checks for any errors that may occur.
store.on('error', (e) => {
	console.log('Store Error', e);
});


const sessionConfig = {
	store,
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

app.use(flash()) //Allow the use of flash method

app.use(passport.initialize());//Allow the use of passport method
app.use(passport.session());//Allow the use of passport session
passport.use(new PassportLocal(User.authenticate())); //Allowing passport to access and create a user authentication method using PassportLocal
passport.serializeUser(User.serializeUser());//Allowing passport to register and handle user Authentication
passport.deserializeUser(User.deserializeUser()); //Allowing passport to undo register and handle user Authentication

//-----------MiddleWare--------------//

app.use((req, res, next) => { //Using our middleware to communicate with our flash method and user
	res.locals.user = req.user;//An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any).
	res.locals.success = req.flash('success');//An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). 
	res.locals.error = req.flash('error');//An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any).
	next();
});

//------------Home Route---------------//

//home.ejs routes 
app.get('/', (req,res) =>{ //default localhost:3000
    res.render('home'); //render home.ejs
});
//-------------------------------------//

//-----------Companies Routes-----------//
app.use('/companies', companyRoutes);
//-------------------------------------//

//-----------Reviews Routes------------//
app.use('/companies/:id/reviews', reviewRoutes);
//-------------------------------------//

//----------Authentication Routes------------//
app.use('/', authRoute)
//-------------------------------------------//

//Error 404
app.use('*',(req, res, next) => {
	//res.status(404).send("Page not found.")
	return next(new AppError('Page not found', 404));
});

//Read status and send the error message to the server
app.use((err, req, res, next) => {
	const { status = 500 } = err; //status = 500
	const { message = 'I am in danger' } = err;
	res.status(status).render('error', {err});
});

//set a port for heroku because they don't use localhost:3000
const port = process.env.PORT || 3000

app.listen(3000, () => {//listening in to localhost 3000
    console.log(`listening on port ${port}`);
});