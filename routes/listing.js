const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn,isOwner } = require("../middleware.js");

const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

// Validate listing
// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

router
.route("/").get( 
  wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  
  wrapAsync(listingController.createNewListing)
);

//combine of show and update
// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,
  upload.single('listing[image]'),isOwner, wrapAsync(listingController.updateListing))
.delete( isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editListing));

module.exports = router;
