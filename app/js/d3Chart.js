var d3 = require('d3'),
  _ = require('lodash');

// todo - pre-render chart on server :/
// rawData = require('../../processData.js'),
// ReactFauxDom = require('react-faux-dom');
var margin = {
  top: 10,
  right: 0,
  bottom: 20,
  left: 0
};

var _private = {
  formatDate: d3.time.format("%Y-%m-%d"),
  parseDate: d3.time.format("%Y-%m-%d")
    .parse,
  width: parseInt(d3.select('#chart')
    .style('width'), 10),
  height: window.innerHeight,
};

var xScale = d3.time.scale()
  .range([0, _private.width]);

var yScale = d3.scale.linear()
  .range([_private.height, 0]);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("right")
  .ticks(5);
var dataSet = [];

var svg = d3.select("div#chart")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + parseInt(_private.width + margin.left + margin.right) + " " + parseInt(_private.height + margin.bottom + margin.top))
  .classed("svg-content-responsive", true)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var d3Chart = module.exports = (function () {
  var _public = {
    data: [],
    sellDate: new Date("Aug 31 2007 00:00:00 GMT-0700 (PDT)"),
    buyDate: new Date("Tue Mar 31 2009 00:00:00 GMT-0700 (PDT)"),
    userHeld: [],
    userSold: [],
    userDataInit: 1000,
    get: function (url) {
      return new Promise(function (resolve, reject) {
        d3.json(url)
          .on("progress", function () {
            console.log("progress", d3.event.loaded);
          })
          .on("load", function (json) {
            resolve(json);
          })
          .on("error", function (error) {
            reject(error);
          })
          .get();
      });
    },
    processRaw: function (rawData) {
      // Data - DJIA -
      return new Promise(function (resolve, reject) {

        rawData = rawData.dataset.data.reverse();

        _public.data = rawData.map(function (d) {
          var pItem = [];
          pItem.date = _private.parseDate(d[0]);
          pItem.close = +d[4];
          return pItem;
        });

        resolve(_public.data);

      });
    },
    calculateUserHeld: function () {
      if (!_public.data) {
        console.warn('rawData not processed');
      } else {
        _public.userHeld = [];

        _public.data.forEach(function (d, i, a) {
          var prev = _public.userHeld[i - 1];
          var pItem = [];
          pItem.date = d.date;
          pItem.close = d.close;

          if (!prev) {
            pItem.userClose = _public.userDataInit;
            pItem.delta = 0;
          } else {
            pItem.delta = (d.close - prev.close) / prev.close;
            pItem.userClose = +(prev.userClose + (prev.userClose * pItem.delta));
          }

          _public.userHeld.push(pItem);

        });
      }
    },
    calculateUserSold: function () {
      _public.userSold = [];
      var arr = _public.userHeld.slice(0);
      var holdValue;

      arr.forEach(function (d, i, a) {
        var pItem = [];
        pItem.date = d.date;
        pItem.delta = d.delta;

        // dates before sell
        if (d.date <= _public.sellDate) {
          pItem.delta = d.delta;
          pItem.userClose = d.userClose;
        }

        // date range when hold
        if (d.date >= _public.sellDate && d.date <= _public.buyDate) {
          pItem.delta = 0;
          if (holdValue) {
            pItem.userClose = holdValue;
          } else {
            holdValue = d.userClose;
            pItem.userClose = holdValue;
          }
        }

        // date range when buy at bottom
        if (d.date >= _public.buyDate) {
          var prev = _public.userSold[i - 1];
          pItem.date = d.date;
          pItem.delta = d.delta;
          pItem.userClose = +(prev.userClose + (prev.userClose * d.delta));
        }

        _public.userSold.push(pItem);

      });
    },
    drawUserLine: function () {
      _public.calculateUserHeld();
      _public.render(_public.userHeld);
      _public.calculateUserSold();
      _public.render(_public.userSold);

    },
    render: function (data) {

      // create main data set with all lines to be rendered
      dataSet.push(data);

      xScale.domain(d3.extent(data, function (d) {
        return d.date;
      }));

      var yMin = 0;

      var yMax = dataSet.reduce(function (pv, cv) {
        var currentMax = cv.reduce(function (pv, cv, i, a) {
          if (cv.userClose) {
            return Math.max(pv, cv.userClose);
          } else {
            return Math.max(pv, cv.close);
          }
        });
        return Math.max(pv, currentMax);
      }, 0);

      yScale.domain([yMin, yMax]);

      var line = d3.svg.line()
        .x(function (d) {
          return xScale(d.date);
        })
        .y(function (d) {
          if (d.userClose) {
            return yScale(d.userClose);
          } else {
            return yScale(d.close);
          }
        });


      function handleMouseOver(d, i) {
        console.log(d, i);
      }

      function handleMouseOut(d, i) {
        console.log(d, i);
      }

      if (svg.selectAll(".y.axis")[0].length < 1) {
        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
      } else {
        svg.selectAll(".y.axis")
          .transition()
          .duration(1500)
          .call(yAxis);
      }

      var lines = svg.selectAll(".line")
        .data(dataSet)
        .attr("class", "line");

      lines.transition()
        .duration(1500)
        .attr("d", line)
        .style("stroke", function () {
          return '#' + Math.floor(Math.random() * 16777215)
            .toString(16);
        });

        function findValue(d, i) {
          var mouseX = d3.mouse(this.parentNode)[0];
          var dataX = xScale.invert(mouseX);

          var j = d.length;
          while ((j--) && (d[j].date > dataX));

          var datapoint;
          if (j >= 0) {
            if (isNaN(d[j + 1]) || (dataX - d[j].date < d[j + 1].date - dataX)) {
              datapoint = d[j];
            } else {
              datapoint = d[j + 1];

            }
          } else {
            datapoint = d[0];
          }

          div.transition()
            .duration(200)
            .style("opacity", 0.9);
          div.html(datapoint.date + "<br/>" + datapoint.close)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

          //Do something with your datapoint value:
           console.log("Crossed line " + i + " near " + [datapoint.date, datapoint.close, datapoint.userClose]);
        }

      var div = svg.append("div")
        .attr("class", "selection")
        .style("opacity", 1);

      // enter any new lines
      lines.enter()
        .append("path")
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", function () {
          return '#' + Math.floor(Math.random() * 16777215)
            .toString(16);
        })
        .on("mouseover", findValue);

      // exit
      lines.exit()
        .remove();

      // todo - numbers not responsive size
      svg.append("g")
        .attr("class", "x axis")
        .attr("dx", ".71em")
        .call(xAxis);
    }

  };

  return _public;

})();

// todo - separate draw axis, etc from the line(s)
d3Chart.get("/data")
  .then(d3Chart.processRaw)
  .then(d3Chart.render);
