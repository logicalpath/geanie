
/**
 * The Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();



app.set('port', process.env.PORT || 5555);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.locals({
    title: 'LogicalPath Geanie'    // default title
});

// The Routes


app.get('/', routes.site.index);
app.get('/persons', routes.persons.list);
app.post('/persons', routes.persons.create);
app.get('/persons/:id', routes.persons.show);
app.del('/persons/:id', routes.persons.del);
app.post('/persons/:id/addParent', routes.persons.addParent);
app.post('/persons/:id/setParent', routes.persons.setParent);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
