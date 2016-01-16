require('babel-core/register');

var express     = require('express'),
    http        = require('http'),
    request     = require('request'),
    fs          = require('fs'),
    routes      = require('./routes'),
    d3          = require('d3');
    data        = require('./processData');

var app = express();
app.locals.pretty = true;

app.use('/', express.static(__dirname + '/app/dist/' ));

app.get('*', routes.index);

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});
