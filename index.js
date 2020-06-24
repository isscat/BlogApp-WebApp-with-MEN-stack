var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var MethodOverride = require('method-override');
var mongoose=require("mongoose");
var flash=require("connect-flash");
var isLoggedIn=require("./middleware").isLoggedIn;
var checkOwner=require("./middleware").checkOwner;

//collections
var blog=require("./models/Post");
var user =require("./models/user");
var comments=require("./models/comments");

//app configure
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(MethodOverride('_method'))
app.use(bodyParser.urlencoded({extended:true}));
// app.use(flash);

//database
const uri = "mongodb+srv://indhu:indhu@cluster0.p1ent.mongodb.net/blogapp?retryWrites=true&w=majority";
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
  }).then(res=>{
		  console.log("DB Connected!")
  }).catch(err => {
	console.log(Error, err.message);
  })
mongoose.connect(uri,{
	useUnifiedTopology:true,
	useNewUrlParser:true
});


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<username>:<password>@cluster0.p1ent.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//express-session configure
app.use(require("express-session")({
secret:"I'm the legend",
resave:false,
saveUninitialized:false
}));

//passport importing
var passport=require("passport");
 var passportLocal=require("passport-local");
 var passportLocalMongoose=require("passport-local-mongoose");

 //passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
//==============================================


//middleware for all routes
app.use(function(req,res,next){
res.locals.currentUser=req.user;

next();
});

// var blogRoutes=require("./routes/blogs");
app.get("/",function(req,res){
    res.redirect("/blogs")
    });
    
    app.get("/blogs",function(req,res){
        blog.find({},function(err,blogs){
            if(err)
                throw err;
            res.render("index",{blogs:blogs});
        });
    });
    
    //New Route
    app.get("/blogs/new",isLoggedIn,function(req,res){
        res.render("new");
    });
    
    //create route
    app.post("/blogs",isLoggedIn,function(req,res){
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
    app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id).populate("selfComment").exec(function(err,found){
    if(err)
        throw err;
        //console.log(req.user);
        res.render("show",{blog:found});
    });
    });
    
    //Route edit
    app.get("/blogs/:id/edit",checkOwner,function(req,res){
    
    
            blog.findById(req.params.id,function(err,found){
                
                        
                            res.render("edit",{blog:found});		
                        
                        
                });
            
    
    });
    //update route
    app.post("/blogs/:id",checkOwner,function(req,res){
        blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundBlog){
            res.redirect("/blogs/"+req.params.id);
        });
    
    });
    
    //DELETE ROUTE
    app.delete("/blogs/:id/",checkOwner,function(req,res){
        blog.findByIdAndRemove(req.params.id,function(err){
            res.redirect("/blogs/");
        })
    });

// ==============================================
var commentRoutes=require("./routes/comments");
var authRoutes=require("./routes/auth");
// app.use(blogRoutes);
app.use(commentRoutes);
app.use(authRoutes);




app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("BlogApp server started!");
})