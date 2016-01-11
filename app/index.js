// 'use strict';
// note - vendor deps
var React = require('react'),
    ReactDOM = require('react-dom'),
    d3Chart = require('./js/d3Chart.js');

// note - app deps
var inputForm = require('./js/userInput.js');

// todo - fix child/parent issue
ReactDOM.render(React.createElement(inputForm), document.getElementById('app'));
