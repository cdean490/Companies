const mongoose = require('mongoose');//enabling mongoose

const Company = require("../models/company");//enabling and importing our objected oriented model from company.js and pass it to const Company

//Mongoose connecting to Mongo
mongoose.connect('mongodb://localhost:27017/companyCapstone', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));

const sampleData = [
    {companyname:"LACI", 
	 image:"https://laincubator.org/wp-content/uploads/LACI_ID_Silver_K-copy-1.png",
     description:"Sustainability and Inclusive green economy",
	 missions:"LACI is unlocking innovation through startups, transforming markets with partnerships and enhancing community inside our campus and out in our neighborhoods.",
	 culture:"Founders Business Accelerator",
	 locations:"525 S. Hewitt Street Los Angeles, CA 90013",
	 links: "https://laincubator.org/",
	 submittedBy: "606f4a6faa64ec70a82b98fa",
	},
    {companyname:"Nuleep",
	 image:"https://images.squarespace-cdn.com/content/5f288c80456ca228fb217784/1607387219123-3PRCIAT8VLOUUF3VBAS7/Nuleep+Logo+-+No+Padding.png?content-type=image%2Fpng", 
     description:"Leap into a new career",
	 missions:"Nuleep uses machine learning and analytics to match you with companies and jobs that fit your career goals, values, and lifestyle.",
	 culture:"Develop Skills, Build Relationships, and Maximize Engagement",
	 locations:"800 Wilshire Blvd 2nd Floor, Los Angeles, CA 90017",
	 links: "https://www.nuleep.com/",
	 submittedBy: "606f4a6faa64ec70a82b98fa",
    },
    {companyname:"Sony",
	 image:"https://wallpaperaccess.com/thumb/903119.jpg", 
     description:"Anything I make you believe, no questions ask",
	 missions:"At Sony, our mission is to be a company that inspires and fulfils your curiosity. Our unlimited passion for technology, content and services, and relentless pursuit of innovation, drives us to deliver ground-breaking new excitement and entertainment in ways that only Sony can.",
	 culture:"Organizational culture focuses on customer satisfaction",
	 locations:"25 Madison Avenue, New York, NY, 10010",
	 links: "https://www.sony.com/en/",
	 submittedBy: "606f4a6faa64ec70a82b98fa",
    },
    {companyname:"Tesla",
	 image:"https://media-exp1.licdn.com/dms/image/C4D0BAQHUcu98SZ2TVw/company-logo_200_200/0/1607665771371?e=2159024400&v=beta&t=bEZo7iNqKSVXRtCEq1oRlawwj1WGQRbM_StCjDdlHnM", 
     description:"A crazy man on a mission to make electric car work",
	 missions:"Tesla’s mission is to accelerate the world’s transition to sustainable energy. The focus on sustainability indicates the compliance of the company with global demands of business methods that align with calls for green energy.",
	 culture:"Tesla's organizational culture empowers its workforce to search for ideal solutions that make the business stand out in the automotive industry and the energy generation and storage industry. The company encourages employees to innovate to support continuous improvement of the business.",
	 locations:"10250 Santa Monica Blvd Ste. 1340 Los Angeles, CA 90067",
	 links: "https://www.tesla.com/",
	 submittedBy: "606f4a6faa64ec70a82b98fa",
    },
];
//https://images.unsplash.com/photo-1532617074212-c503101ae0b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80

// We first clear our database and then add in our company sample 
const seedDB = async () => {//
	await Company.deleteMany({});//Clear or deleting the whole database
	const res = await Company.insertMany(sampleData) //add or insert our SampleData with then and catch to check if data has been passed or not?
		.then((data) => console.log('Data inserted'))
		.catch((e) => console.log(e));
};

// We run our seeder function then close the database after.
seedDB().then(() => {//run the seedDB function from above and then close the mongoose database afterwards.
	mongoose.connection.close();
});
