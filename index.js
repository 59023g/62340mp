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

app.use("/", express.static(__dirname + "./app/dist/"));

app.get('/', routes.index);

// GET recession data from Yahoo Finance API
// https://gist.github.com/fincluster/6145995
request
  .get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20IN%20(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env')
  .on('error', function(err) {
  console.log(err);
  })
  .on('response', function(response) {
    console.log(response.statusCode); // 200
    console.log(response.headers['content-type']);
  })
  .pipe(fs.createWriteStream('data.json'));

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});
