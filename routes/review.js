const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controllers/reviews.js")


//validate listing 
const validateListing=(req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(result);
    if(error){
      let errMsg =error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, result.error);
    }
    else{
      next();
    }
  }

//rating Route
router.post("/",
  isLoggedIn,
  wrapAsync(reviewController.createReview));
  
  //delete rating route
  
  router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
  );



  module.exports=router;