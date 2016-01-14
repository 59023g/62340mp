var React   = require('react'),
  ReactDOM  = require('react-dom/server');


var App = React.createFactory( require('./app/app.js') );

var routes = {
  index: function(req, res) {
      var markup = ReactDOM.renderToString(App());
      res.send(markup);
  }
};

module.exports = routes;
