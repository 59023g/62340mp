// note - vendor deps
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

// note - app deps
var inputForm = require('./js/inputForm');

var render = function() {
  ReactDOM.render(React.createElement(inputForm), document.getElementById('content'));
};

render();
