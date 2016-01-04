require('babel-core/register');

var express = require('express'),
    http = require('http'),
    request = require('request'),
    fs = require('fs'),
    routes = require('./routes');

    // redis = require('redis');
    // https://www.npmjs.com/package/request

var app = express();

// console.log(process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);

// var client = redis.createClient('6379', 'redis');

app.use("/", express.static(__dirname + "/app/dist/" ));

app.get('/react-proto', routes.index);


http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});
