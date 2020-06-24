var express=require("express");
var router=express.Router();
var mongoose=require("mongoose");
var blog=require("../models/Post");
var isLoggedIn=require("../middleware").isLoggedIn;
var checkOwner=require("../middleware").checkOwner;




router.get("/",function(req,res){
    res.redirect("/blogs")
    });
    
    router.get("/blogs",function(req,res){
        blog.find({},function(err,blogs){
            if(err)
                throw err;
            res.render("index",{blogs:blogs});
        });
    });
    
    //New Route
    router.get("/blogs/new",isLoggedIn,function(req,res){
        res.render("new");
    });
    
    //create route
    router.post("/blogs",isLoggedIn,function(req,res){
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var newBlog=req.body.blog;
    newBlog.author=author;
    blog.create(newBlog,function(err,newBlog){
    if(err)
        throw err;
        console.log(newBlog);
    res.redirect("/blogs");
    });
    });
    
    
    
    
    
    
    
    //show route
    router.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id).populate("selfComment").exec(function(err,found){
    if(err)
        throw err;
        //console.log(req.user);
        res.render("show",{blog:found});
    });
    });
    
    //Route edit
    router.get("/blogs/:id/edit",checkOwner,function(req,res){
    
    
            blog.findById(req.params.id,function(err,found){
                
                        
                            res.render("edit",{blog:found});		
                        
                        
                });
            
    
    });
    //update route
    router.post("/blogs/:id",checkOwner,function(req,res){
        blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundBlog){
            res.redirect("/blogs/"+req.params.id);
        });
    
    });
    
    //DELETE ROUTE
    router.delete("/blogs/:id/",checkOwner,function(req,res){
        blog.findByIdAndRemove(req.params.id,function(err){
            res.redirect("/blogs/");
        })
    });

    module.exports=router;