mongoose=require("mongoose");
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"user"
		},
		username:String
	},
	selfComment:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"comments"
		}
	],
	created:{type:Date,default:Date.now}	
});
module.exports = mongoose.model("blog",blogSchema);