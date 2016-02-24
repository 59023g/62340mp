var React     = require('react');
var UserInput = require('./js/userInput.js'); //this is the box component

var App = module.exports = (function() {

  var _public = {
    mainView: React.createClass({
      render: function() {
          return (
              <html>
                  <head>
                  <link rel="stylesheet" href="css.css"/>
                  <link href='https://fonts.googleapis.com/css?family=Droid+Sans+Mono' rel='stylesheet' type='text/css'/>
                      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                      <title>
                          App
                      </title>
                  </head>
                  <body>
                    <div id='app'>
                    <div id='chart'></div>
                    <div id='input'></div>

                    </div>

                    <script src="libs.js"></script>
                    <script src="app.min.js"></script>
                  </body>
              </html>
          );
      }
    })
  };

  return _public;
})();
