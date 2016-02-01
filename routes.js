var React  = require('react'),
  ReactDOM = require('react-dom/server'),
  App      = React.createFactory(require('./app/app.js').mainView);

var routes = module.exports = (function() {
  var _public = {
    index: function(req, res) {
      var markup = ReactDOM.renderToStaticMarkup(App());
      res.send(markup);
    }
  };

  return _public;

})();
