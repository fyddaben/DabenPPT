var pygmentize = require('pygmentize-bundled');

var marked = require("marked");

var con=require("./util/Constant");

var PPT=require("../model/PPT");
/*
 * GET home page.
 */

exports.index = function(req, res){
	
	var num=con.randomId(8,16);

	var newSql={"curpage":1,"backNeed":1,"scale":1,"coord":{"x":0,"y":0,"z":0},"TwodDeg":0,"ThrdXDeg":0,"ThrdYDeg":0};
	
	var sql=JSON.stringify(newSql);
	
  	res.render('index', {fql:null,sql:sql,titleid:num});
};

exports.ppt=function(req,res){

  res.render("ppt");

}
/*
	点击完成，保存内容
*/
exports.contentSave=function(req,res){

	var content=req.body.content;
	
	var sql=req.body.sql;

	var pptid=req.body.id;

	var markCon=req.body.markCon;

	var special=JSON.parse(sql);

	var obj={
		curpage:special.curpage,
		content:content,
		markCon:markCon,
		createTime:con.currentDate(),
		pptid:pptid
	}
	obj.special=sql;

	var query={
		pptid:pptid,
		curpage:special.curpage
	}
	PPT.findOneAndUpdate(query,obj,{upsert:true},function(){
		res.send("save success");
	});

}
/*
	点击下一页，保存内容，并重新生成一个新的页面
*/
exports.contentAdd=function(req,res){

	var content=req.body.content;
	
	var sql=req.body.sql;

	var pptid=req.body.id;

	var markCon=req.body.markCon;

	var special=JSON.parse(sql);

	var page=1;

	var xpos=0;

	try{
		var obj={
			curpage:special.curpage,
			content:content,
			markCon:markCon,
			createTime:con.currentDate(),
			pptid:pptid
		}
		obj.special=sql;

	

		page=parseInt(special.curpage)+1;

		xpos=parseInt(special.curpage)*1500;


		var yesCon=function(ppt){

			var data={};

			data.code=200;

			data.info=JSON.parse(ppt.special);

			data.con=ppt.content;

			data.ppcon=ppt.markCon;


			res.send(data);

		}
		var findUpdate=function(flag){
			var query={
				pptid:pptid,
				curpage:special.curpage
			}
			PPT.findOneAndUpdate(query,obj,{upsert:true},function(){
				console.log("修改成功 ");
			});

			var newSql={"curpage":page,"backNeed":special.backNeed,"scale":special.scale,"coord":{"x":xpos,"y":special.coord.y,"z":special.coord.z},"TwodDeg":special.TwodDeg,"ThrdXDeg":special.ThrdXDeg,"ThrdYDeg":special.ThrdYDeg};

			var data={};

			data.code=400;

			data.info=newSql;


			if(flag){
				res.send(data);	
			}
			

		}
		var params={
				
			pptid:pptid,
			curpage:page
		}
		var curPar={
			pptid:pptid
		}
		var findFun=function(err,ppt){

			if(err)console.log(err);
			
			yesCon(ppt[0]);

		}

		PPT.count(curPar,function(err,count){

			var curpage=parseInt(special.curpage);

			if(curpage<count){
				
				findUpdate(false);
				PPT.find(params).exec(findFun);
			}else{
				findUpdate(true);
			}


		});
		

	}catch(e){

	}

	

}
/*
	传入id，得到修改页面
*/
exports.pptUpdate=function(req,res){

	var pptid=req.params.id;

	var sql={

		pptid:pptid,
		curpage:1
	}
	var callback=function(err,ppt){

		if(err)console.log(err);

		var Fsql={
			con:ppt.content,
			ppCon:ppt.markCon
		}

		res.render("index",{fql:Fsql,sql:ppt.special,titleid:pptid});
	}
	PPT.findOne(sql).exec(callback);

}

/*
	点击上一页，
	参数:pptid
	结果，content及mark之后的content，配置条件
*/
exports.contentFind=function(req,res){
	 
	var params=req.params;

	var pptid=params.id;

	var page=parseInt(params.page);

	var sql={
		pptid:pptid,
		curpage:page
	}
	var callback=function(err,ppt){

		if(err)console.log(err);

		var Fsql={
			con:ppt.content,
			ppCon:ppt.markCon,
			spec:ppt.special
		}

		res.send(Fsql);

	}
	PPT.findOne(sql).exec(callback);

}

/*
	传入id，得到所有的ppt内容
*/

exports.pptShow=function(req,res){

	var id=req.params.id;

	var sql={
		pptid:id
	}

	var callback=function(err,ppt){
		if(err)console.log(err);
		
		var data=[];
		for(var i in ppt){
			var spec=ppt[i].special;
			var obj={
				conf:JSON.parse(spec),
				content:ppt[i].markCon
			}
			data.unshift(obj);
		}

		res.render("ppt",{ppts:data});

	}

	PPT.find(sql).sort('-curpage').exec(callback);



}
exports.demo=function(req,res){

	res.render("pptDemo");

}
/* 
在线 markdown调用接口
*/
exports.markEdit=function(req,res){

		var content=req.body.content;

		var Concallback=function(ok,str){

			res.send(str);

		}
		mark(content,Concallback);

}

function mark(content,callback){

	
	var options={
		gfm: true,
		highlight: function (code, lang, callback) {
			pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
			if (err) return callback(err);
				callback(null,result.toString());
			});
		},
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: true,
		smartypants: false,
		langPrefix: 'lang-'
	};

	marked(content,options,callback);

}