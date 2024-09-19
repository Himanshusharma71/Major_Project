if(process.env.NODE_ENV !="production"){

  require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const { cookie } = require("express/lib/response.js");


const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("models", path.join(__dirname, "models"));
// app.set("init", path.join(__dirname, "init"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error",()=>{
  console.log("Error in mongo session store ",err)
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitializerd:true,
  cookie:{//here we added the experiory date of the session and cookie 
    expires:Date.now() +7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
};




app.use(session(sessionOptions));
app.use(flash());


//passport libeary used for authentication of user and used for login and signup 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  console.log(res.locals.success);
  next();
});

//Demo user
// app.get("/demouser",async (req, res) => {
//   let fakeUser=new User({
//     //here we create a fake user
//     email:"hela@gmail.com",
//     username:"heriistudents"
//   });
//   //storing the fake user
//   let registeredUser=await User.register(fakeUser,"Helloindia");//this method automatic save user with the password 
//   res.send(registeredUser);
//   // console.log(registeredUser);

// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req, res,next)=>{
  next(new ExpressError(404," Page Not Found !"));
});

app.use((err, req, res, next)=>{
  let { statusCode=500 , message ="something is wrong"} =err;
  res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});