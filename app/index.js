// 'use strict';
// note - vendor deps
var React    = require('react'),
    ReactDOM = require('react-dom'),
    // todo - pre-render chart on server
    d3Chart  = require('./js/d3Chart.js');

// note - app deps
var inputForm = require('./js/userInput.js');

ReactDOM.render(React.createElement(inputForm), document.getElementById('input'));
