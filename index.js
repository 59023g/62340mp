var express = require('express'),
    http = require('http'),
    redis = require('redis');

var app = express();

// console.log(process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);

// APPROACH 2: Using host entries created by Docker in /etc/hosts (RECOMMENDED)
var client = redis.createClient('6379', 'redis');

app.get('/', function(req, res, next) {
  client.incr('counter', function(err, counter) {
    console.log('bo')
    if(err) return next(err);
    res.send('This page has been viewedd ' + counter + ' times!');
  });
});

app.

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});
