const express = require('express');//enabling express 
const router = express.Router({ mergeParams: true });//Alowing express to create a router path and setting the params to true because some params aren't the same.
const asyncCatcher = require('../utilities/asyncCatcher');//enabling and grabbing the asyncCather.js
const Company = require('../models/company');//enabling and grabbing the object oriented model
const Review = require('../models/review');//enabling and importing reviews object oriented model
const {validateReview, isAuthenticated, isReviewCreator} = require('../middleware/middleware');

//--------------------------Middleware--------------------------------//

//--------------------------------------Review Routes---------------------------------//

//Create a new review, show.ejs
router.post('/', isAuthenticated, validateReview, asyncCatcher( async (req,res) =>{ //no foward slash in single quotes works too.
	const {id} = req.params;// grabbing the id from the url
	const company = await Company.findById(id);//checking to see if the id from the url matches with the id from the database
	const review = new Review(req.body.review);//grabbing the form you have from show.ejs
	review.author = req.user._id;//grabbing the user _id from the database and pass it to review.authorization
	company.reviews.push(review);//everytime a review is submitted, new one gets pushed
	await company.save(); //save the form
	await review.save(); //save the form
	req.flash('success', 'New Review was successfully added!');
	res.redirect(`/companies/${id}`); //redirect to the /companies/id of the reviews
}));

router.delete('/:reviewId', isAuthenticated, isReviewCreator, asyncCatcher(async (req,res) =>{//deleting review ids
	const {id, reviewId} = req.params;//grabbing both id and reviewId of the url
	await Company.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});//checking to see if the id matches from the database and then update the review. 
	await Review.findByIdAndDelete(reviewId);//Find one particular reivewId and delete
	req.flash('success', 'New Review was successfully deleted!');
	res.redirect(`/companies/${id}`);//redirct to /companies/id
}));

//----------------------------------------------------------------------------------//

module.exports = router;
