const mongoose =require("mongoose");
const schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new mongoose.Schema({
    // Here user name and password is automatic define by the passportLocalMongoose
    //that is by we only assign the email
    //passportlocal mongoose is auto set solting hashing password
    email:{
        type:String,
        required:true,
    }
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);

