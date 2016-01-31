var React = require('react'),
  ReactDOM = require('react-dom/server'),
  App = React.createFactory(require('./app/app.js').mainView);

var routes = (function() {
  var _public = {
    index: function(req, res) {
      var markup = ReactDOM.renderToString(App());
      res.send(markup);
    }
  };

  return _public;

})();

module.exports = routes;
