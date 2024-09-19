const joi = require('joi');
const Listing = require("./models/listing.js");


module.exports.listingSchema =joi.object({
    Listing: joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required(),
        image:joi.string().allow("", null),
    }).required(),
});

module.exports.reviewSchema =joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required()

})
