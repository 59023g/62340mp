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
    d3Chart.data = data.dataset.data;

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var formatDate = d3.time.format("%Y-%m-%d");
    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = d3.time.scale()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .x(function(d, i) {
        return x(d.date);
      })
      .y(function(d) {
        // console.log(d[4])
        return y(d.close);
      });

    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3Chart.data.forEach(function(d) {
      d.date = formatDate(parseDate(d[0]));
      d.close = +d[4];
      console.log(d.date, d.close);
     });

    x.domain(d3.extent(d3Chart.data, function(d) {
      return parseDate(d[0]);
    }));
    y.domain([0, d3.max(d3Chart.data, function(d) { return d.close; })]);

    // y.domain(d3.extent(d3Chart.data, function(d) {
    //   return d[4];
    // }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

    svg.append("path")
      .datum(d3Chart.data)
      .attr("class", "line")
      .attr("d", line);
  });


module.exports = d3Chart;
