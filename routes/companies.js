const express = require('express');//enabling express
const router  = express.Router();//Alowing express to create a router path 
const asyncCatcher = require('../utilities/asyncCatcher');//enabling and grabbing the asyncCather.js
const Company = require('../models/company');//enabling and grabbing the object oriented model
const {validateCompany,isAuthenticated,isCreator} = require('../middleware/middleware');//enabling and importing our object of isAuthenticated

//--------------------------Middleware--------------------------------//

//---------------------------------------------------------Routes------------------------------------------------------------------//
//index.ejs routes
router.get('/', asyncCatcher(async (req,res) => {//localhost:3000/companies 
    const companies = await Company.find({});//waiting to find all companies in the database
    res.render('companies/index', {companies});//render our index.ejs
}));

//new.ejs routes
router.get('/new', isAuthenticated, (req,res) => {//localhost:3000/companies/new
	res.render('companies/new'); //render our new.ejs or create our form
});

//Creat a new company, new.ejs
router.post('/', isAuthenticated, validateCompany, asyncCatcher(async (req, res) => {//Sending or posting info from our form and redirect to companies or express app
	const company = new Company(req.body.company); //grabbing the form you have from new.ejs
	company.submittedBy = req.user._id;//Only the submitted user can be allowed to add company, edit, or delete
	await company.save();//save the form
	req.flash('success', 'New Company was successfully added!');//flash success
	res.redirect(`/companies/${company.id}`);//redirect to /companies/id
}));

//edit.ejs
router.get('/:id/edit', isAuthenticated, isCreator, asyncCatcher(async (req, res) => {//The option to edit after submitting the original form
	const {id} = req.params; //grabbing the id from url
	const company = await Company.findById(id);//checking to see if the id from the url matches with the id from the database
	if (!company) {
		req.flash('error','Company does not exist!');
		res.redirect('/companies');
	}
	res.render('companies/edit', {company}); //render our edit.ejs
}));

// Route: /companies
// Method: GET
// Desc: Render companies index
// Render: show.ejs
// Permissions: Public
//show.ejs
router.get('/:id', asyncCatcher(async (req,res,next) =>{
    const {id} = req.params;//grabbing the id from the url
    const company = await Company.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('submittedBy');//checking to see if the id from the url matches with the id from the database and then connect with other documents from review.js
	if (!company) {
		req.flash('error','Company does not exist!');
		res.redirect('/companies');
	}
    res.render('companies/show', {company});//render our show.ejs
})); //return next(new AppError('Product not found!', 404));//if not company, then return an error

//Update your form
router.put('/:id', isAuthenticated, isCreator, validateCompany, asyncCatcher(async (req,res) => {//put method allows finding the id, edit, and update.
	const {id} = req.params;//grabbing the id url
	const company = await Company.findByIdAndUpdate(id, {...req.body.company});//checking to see if id matches from the database and then update the form
	req.flash('success', 'New Company was successfully updated!');
	res.redirect(`/companies/${company.id}`);//redirect /companies/id
}));

router.delete('/:id/delete', isAuthenticated, isCreator, asyncCatcher(async (req,res) => {//delete method allows the termination of an object when the id matches
	const {id} = req.params;//grabbing the id from the url
	await Company.findByIdAndDelete(id);//find and delete when the id of object matches
	req.flash('success', 'New Company was successfully deleted!');
	res.redirect('/companies'); //redirect it to /companies
}));

module.exports = router;