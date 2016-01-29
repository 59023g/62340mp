var d3 = require('d3'),
  fs = require('fs'),
  _ = require('lodash'),
  q = require('q');
// todo - pre-render chart on server :/
// rawData = require('../../processData.js'),
// ReactFauxDom = require('react-faux-dom');
var d3Chart = {
  userDataInit: 10000,
  userData: [],
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
  },
  formatDate: d3.time.format("%Y-%m-%d"),
  parseDate: d3.time.format("%Y-%m-%d").parse,
  width: parseInt(d3.select('#chart').style('width'), 10),
  height: 1060,
  drawLineChart: function(data) {

    var x = d3.time.scale()
      .range([0, d3Chart.width]);

    var y = d3.scale.linear()
      .range([d3Chart.height, 0]);

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
        return y(d.close);
      });

    var userLine = d3.svg.line()
      .x(function(d, i) {
        return x(d[0]);
      })
      .y(function(d) {
        return y(d[2]);
      });

    var svg = d3.select("div#chart")
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + d3Chart.width + " " + d3Chart.height)
      .classed("svg-content-responsive", true)
      .append("g");

    data = data.dataset.data;
    data.reverse();

    data.forEach(function(d, i, a) {

      d.date = d3Chart.parseDate(d[0]);
      d.close = +d[4];
      var prev = a[i - 1];

      if (!prev) {
        d.delta = 0;
        d.userClose = d3Chart.userDataInit;
        d3Chart.userData.push([d.date, d.delta, d.userClose]);
      } else {
        d.delta = (d[4] - prev[4]) / prev[4];
        d.userClose = +(prev.userClose + (prev.userClose * d.delta));
        d3Chart.userData.push([d.date, d.delta, d.userClose]);
      }
    });

    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.close;
    })]);

    // todo - numbers not responsive size
    svg.append("g")
      .attr("class", "x axis")
      .attr("dx", ".71em")
      .call(xAxis);

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    svg.append("path")
      .datum(d3Chart.userData)
      .attr("class", "user-line")
      .attr("d", userLine);
  }

};

// todo - separate draw axis, etc from the line(s)
d3Chart.get("/data")
  .then(d3Chart.drawLineChart);



module.exports = d3Chart;
