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


      var assign = function(context) {
        var cb = function(err, data) {
          var args = Array.prototype.slice.call(arguments);
          console.log(args);
          if (err) {
            return console.warn(err);
          }
          context.data = data.dataset;
        };
        return cb;
      };


      d3.json(url, assign(this));


  }
};


d3Chart.get("/data");
// .then(function(result) {console.log(result); })


module.exports = d3Chart;
