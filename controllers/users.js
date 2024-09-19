const User=require("../models/user.js");
module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signup=async(req,res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({email,username});
        const registeredUser= await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to smartbhartiya");
            res.redirect("/listings");
        })
    }catch(error){
        req.flash("error","this username and email is alredy taken");
        req.redirect("/signup");
    }
}


module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back to SmartBhartiya 😁🙏");
    res.redirect("/listings");
  }

module.exports.renderlogin=(req,res)=>{
    res.render("users/login.ejs");
}

  module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you Logged out successfully");
        res.redirect("/listings");
    });
}
