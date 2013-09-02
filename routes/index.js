var pygmentize = require('pygmentize-bundled');
var marked = require("marked");
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/* 
在线 markdown调用接口
*/
exports.markEdit=function(req,res){

		var content=req.body.content;

		
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

		var Concallback=function(ok,str){

			res.send(str);

		}
		marked(content,options,Concallback);

}