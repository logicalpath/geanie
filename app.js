
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.locals({
    title: 'LogicalPath Geanie'    // default title
});

// Routes

app.get('/', routes.site.index);

app.get('/persons', routes.persons.list);
app.get('/persons/:id', routes.persons.show);
app.post('/persons/:id', routes.persons.edit);
app.del('/persons/:id', routes.persons.del);

app.post('/persons/:id/follow', routes.persons.follow);
app.post('/persons/:id/unfollow', routes.persons.unfollow);
app.post('persons/:id/related', routes.persons.related);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
