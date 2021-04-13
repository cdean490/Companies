const Joi = require('joi');//enabling joi 

module.exports.companySchema = Joi.object({////Joi checks to see if the method specified in an object oriented model is correct or not. 
    company: Joi.object({ //Joi is an object schema desciption language and a validator for Javascript objects.
        companyname: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        missions: Joi.string().required(),
        culture: Joi.string().required(),
        locations: Joi.string().required(),
        links: Joi.string().required(),
    })

});

module.exports.reviewSchema = Joi.object({//This is for the reviewSchema
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().required().min(1).max(5),
	}).required(),
});
