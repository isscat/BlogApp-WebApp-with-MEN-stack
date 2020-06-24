var express=require("express");
var router=express.Router();
var mongoose=require("mongoose");
var blog=require("../models/Post");
var comments=require("../models/comments");
var isLoggedIn=require("../middleware/index").isLoggedIn;
var checkCommentOwner=require("../middleware").checkCommentOwner;
//middlewares

    
//middleware for comment




//new comment
router.get("/blogs/:id/comment/new",isLoggedIn,function(req,res){
	blog.findById(req.params.id,function(err,found){
	if(err)
		throw err;
	
		res.render("comments/new",{comment:found});
	});
	});

//new comment post
router.post("/blogs/:id/comments",isLoggedIn,function(req,res){

	blog.findById(req.params.id,function(err,foundPost){

		newComment=req.body.comment;
		newComment.author={
			id:req.user._id,
			username:req.user.username
		};
		
		//console.log(newComment);
		comments.create(newComment,function(err,newCom){
			foundPost.selfComment.push(newCom);
			foundPost.save();
			res.redirect("/blogs/"+foundPost._id);
		});
	});
	
});


	
//comment edit
router.get("/blogs/:id/comment/:comment_id/edit",checkCommentOwner,function(req,res){
comments.findById(req.params.comment_id,function(err,foundComment){

	res.render("comments/edit",{blog_id:req.params.id,comment:foundComment});
});

});

//post comment
router.put("/blogs/:id/comment/:comment_id/",checkCommentOwner,function(req,res){

	comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,created){
	
		res.redirect("/blogs/"+req.params.id);
	});
	
});

router.delete("/blogs/:id/comment/:comment_id",checkCommentOwner,function(req,res){

	comments.findByIdAndRemove(req.params.comment_id,function(err){
		res.redirect("/blogs/"+req.params.id);
	});
});

module.exports=router;