const AppError = require('../utilities/AppError');//enabling and grabbing the AppError
const Company = require('../models/company');//enabling and grabbing the object oriented model from company.js
const Review = require('../models/review');//enabling and importing reviews object oriented model
const {companySchema, reviewSchema} = require('../joiSchemas')//enabling and importing Joi object oriented model from joiSchemas.js

module.exports.isAuthenticated = (req,res,next) => {
    if(!req.isAuthenticated()){//
        req.flash('error', 'You must be signed in to do that');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateCompany = (req,res,next) =>{ //This is a Middleware function that have access to the request object (req), response object (res), and next will execute
	const {error} = companySchema.validate(req.body)//validating or checking to see if companySchema has any error or not.
	if(error){
		const msg = error.details.map((e) => e.message).join(",")//If there is an error, then that error will be passed to an array of strings joined by a comma
		throw new AppError(msg, 400) //throw an error in status 400 bad request, only throw error for status 400
	}
	else{
		next() //continue if there is no error
	}
};

module.exports.isCreator = async (req,res,next) => {
	const {id} = req.params; //Grabbing the id from the url
	const company = await Company.findById(id);//Checking to see if the id from the url matches with the database.
	if(!company.submittedBy.equals(req.user._id)){
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/companies/${id}`);
	}
	next();
};

module.exports.isReviewCreator = async (req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You are not authorized to do that');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((e) => e.message).join(',');
		throw new AppError(msg, 400);
	} else {
		next();
	}
};