var express=require("express");
var router=express.Router();
var mongoose=require("mongoose");
var user=require("../models/user");
var passport=require("passport");
//authentication======================
//login
router.get("/login",function(req,res){
	res.render("depend/login");
});
router.post("/login",passport.authenticate("local",{
	successRedirect:"/blogs",
	failureRedirect:"/login"
}),function(req,res){
	//console.log(req.user);
});

//register
router.get("/register",function(req,res){
res.render("depend/register");
});


router.post("/register",function(req,res){

	var newUser=new user({username:req.body.username});
	user.register(newUser,req.body.password,function(err,user){
		if(err)
		throw err;
		passport.authenticate("local")(req,res,function(){
			res.redirect("/blogs");

		});

		
	});

});

//logout
router.get("/logout",function(req,res){
req.logOut();
res.redirect("/blogs");
});

module.exports=router;