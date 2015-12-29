var React = require('react'),
    inputForm = require('./app/js/inputForm.js');

module.exports = {
  index: function(req, res) {
    res.render(inputForm);
  }

};
