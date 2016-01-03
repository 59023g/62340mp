var React   = require('react'),
  ReactDOM  = require('react-dom/server'),
  Component = require('./react-render.js');

var ComponentFactory = React.createFactory(Component);

var routes = {
  index: function(req, res) {
      var markup = ReactDOM.renderToString(ComponentFactory());
      res.send(markup);
  }
};

module.exports = routes;
