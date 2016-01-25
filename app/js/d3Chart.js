var d3 = require('d3'),
  fs = require('fs'),
  _ = require('lodash'),
  q = require('q');
// todo - pre-render chart on server :/
// rawData = require('../../processData.js'),
// ReactFauxDom = require('react-faux-dom');

// var data = {};
var d3Chart = {
  data: {},
  get: function(url) {
    return new Promise(function(resolve, reject) {
      d3.json(url)
        .on("progress", function() {
          console.log("progress", d3.event.loaded);
        })
        .on("load", function(json) {
          resolve(json);
        })
        .on("error", function(error) {
          reject(error);
        })
        .get();
    });


  }
};


d3Chart.get("/data")
  .then(function(data) {
    d3Chart.data = data.dataset;
  });


module.exports = d3Chart;
