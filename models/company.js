const mongoose = require('mongoose');//enabling mongoose
const Review =  require('./review');//enabling Review and importing review schema
const Schema = mongoose.Schema; //passing mongoose.Schema to const Schema

//Companies: date founded, about or description,  missions, company's culture, locations, and images.
const companySchema = new Schema({//Usually const companySchema = new mongoose.Schema, replace mongoose.Schema with Schema
    companyname: String,
    image: String,
    description: String,
    missions: String,
    culture: String,
    locations: String, //original was locations: String,
    links: String,
    submittedBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
    reviews:[{ type: Schema.Types.ObjectId,
               ref: 'Review',
            },
        ],
    
});

companySchema.post('findOneAndDelete', async function (data) {//findOneAndDelete allows you to find an id of an object and delete that object as well as deleting all the other id pertaining to that object.
	if (data) {
		await Review.deleteMany({
			_id: {
				$in: data.reviews,
			},
		});
	}
});


module.exports = mongoose.model('company', companySchema);//Exporting our object oriented model