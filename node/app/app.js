var React     = require('react');

var App = module.exports = (function() {

  var _public = {
    mainView: React.createClass({
      render: function() {
          return (
              <html>
                  <head>
                  <link rel="stylesheet" href="css.css"/>
                      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                      <title>
                          fin.mep
                      </title>
                      <link rel="icon" type="image/png" href="favicon-96x96.png" sizes="96x96"/>
                      <link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16"/>
                      <link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32"/>
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
