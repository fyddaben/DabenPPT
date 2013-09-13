
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3006);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/demo', routes.demo);
app.get('/users', user.list);
app.get('/ppt', routes.ppt);
app.get("/ppt/post/:id/:page",routes.contentFind);
app.get("/ppt/:id",routes.pptShow);

app.get("/ppt/update/:id",routes.pptUpdate);


app.post('/mark', routes.markEdit);

app.post("/ppt",routes.contentAdd);
app.post("/pts",routes.contentSave);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
