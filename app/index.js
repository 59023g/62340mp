// 'use strict';
// note - vendor deps
var React = require('react');
var ReactDOM = require('react-dom');

// note - app deps
var inputForm = require('./js/userInput.js');

// todo - fix child/parent issue
ReactDOM.render(React.createElement(inputForm), document.getElementById('app'));
