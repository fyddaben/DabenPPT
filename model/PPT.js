
var mongoose=require('../routes/util/MongoUtil');

var PPTs = mongoose.Schema({

	curpage:Number,
	content:String,
	markCon:String,
	createTime:String,
	special:String,
	pptid:String

});

var ppts = mongoose.model('ppts', PPTs);

module.exports=ppts;