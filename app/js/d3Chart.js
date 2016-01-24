var d3 = require('d3'),
  fs   = require('fs'),
  _    = require('lodash');
// todo - pre-render chart on server :/
// rawData = require('../../processData.js'),
// ReactFauxDom = require('react-faux-dom');

var d3Chart = {
  data: {},
  get: function(url) {
    var data = this.data;
    d3.json(url, function(err, json) {
      if (err) { return console.warn(err); }
      data = json;
    });
  }
};


d3Chart.get("/data");


module.exports = d3Chart;
