var comments=require("../models/comments");
var blog=require("../models/Post");

var middleware={

}
middleware.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated())
    return next();
    
    res.redirect("/login");
}
middleware.checkCommentOwner=function(req,res,next){
	console.log("Hi");
	if(req.isAuthenticated())
	{
		comments.findById(req.params.comment_id,function(err,foundComment){
			console.log(foundComment);
			if(err)
			res.redirect("back");
			else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else
				res.redirect("/blogs");
			}
		});
	}
}
middleware.checkOwner=function(req,res,next){
    console.log(req.user);
    if(req.isAuthenticated()){
            blog.findById(req.params.id,function(err,found){
                
                        if(found.author.id.equals(req.user._id)){
                            next();		
                        }
                        else{
                            res.redirect("back");
                        }
                });
            }
        else{
            
        res.redirect("back");
        }
    }
module.exports=middleware;