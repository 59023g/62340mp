var d3 = require('d3'),
  _ = require('lodash');

// todo - pre-render chart on server :/
// rawData = require('../../processData.js'),
// ReactFauxDom = require('react-faux-dom');
var margin = {
  top: 50,
  right: 0,
  bottom: 20,
  left: 0
};

var selection;
var selectionContent;
var numberFormat = d3.format(".4s");
var _private = {
  formatDate: d3.time.format("%Y-%m-%d"),
  parseDate: d3.time.format("%Y-%m-%d")
    .parse,
  width: parseInt(d3.select('#chart')
    .style('width'), 10),
  height: window.innerHeight - margin.top - margin.bottom,
};

var xScale = d3.time.scale()
  .range([0, _private.width]);

var yScale = d3.scale.linear()
  .range([_private.height, 0]);

var xAxis = d3.svg.axis()
  .scale(xScale);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("right")
  .ticks(5)
  .tickFormat(function (d) {
    return numberFormat(d);
  });
var dataSet = [];

var svg = d3.select("div#chart")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + parseInt(_private.width + margin.left + margin.right) + " " + parseInt(_private.height + margin.bottom + margin.top))
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var d3Chart = module.exports = (function () {
  var _public = {
    data: [],
    sellDate: new Date("Sep 31 2007 00:00:00 GMT-0700 (PDT)"),
    buyDate: new Date("Tue Mar 31 2009 00:00:00 GMT-0700 (PDT)"),
    userHeld: [],
    userMonthlyFixedData: [],
    userSold: [],
    userEquityHoldings: 1000,
    userMonthlyFixed: 1000,
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
          var prevEquityHoldings = _public.userHeld[i - 1];
          var prevMonthlyFixed = _public.userMonthlyFixedData[i - 1];

          var pItem = [];
          var pItemMonthlyFixed = [];
          pItem.date = d.date;
          pItemMonthlyFixed.date = d.date;
          pItem.close = d.close;


          if (!prevEquityHoldings) {
            pItem.userClose = _public.userEquityHoldings;
            pItem.delta = 0;

            pItemMonthlyFixed.userClose = _public.userEquityHoldings;
            pItemMonthlyFixed.delta = 0;
          } else {
            pItem.delta = (d.close - prevEquityHoldings.close) / prevEquityHoldings.close;

            pItem.userClose = +(prevEquityHoldings.userClose + (prevEquityHoldings.userClose * pItem.delta));

            pItemMonthlyFixed.delta = pItem.delta;

            pItemMonthlyFixed.userClose = +((prevMonthlyFixed.userClose + _public.userMonthlyFixed) + (prevMonthlyFixed.userClose * pItem.delta));
          }


          _public.userHeld.push(pItem);
          _public.userMonthlyFixedData.push(pItemMonthlyFixed);

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
    calculateMonthlyFixed: function() {
      _public.userMonthlyFixedData = [];
      var arr = _public.userHeld.slice(0);
      var holdValue;

      if (!_public.userHeld) {
        console.warn('userHeld not processed');
      } else {
        arr.forEach(function (d, i, a) {
          var prevMonthlyFixed = _public.userMonthlyFixedData[i - 1];

          var pItemMonthlyFixed = [];
          pItemMonthlyFixed.date = d.date;

          if (!prevMonthlyFixed) {
            pItemMonthlyFixed.userClose = _public.userEquityHoldings;
            pItemMonthlyFixed.delta = 0;
          } else {
            pItemMonthlyFixed.delta = d.delta;

            pItemMonthlyFixed.userClose = (prevMonthlyFixed.userClose + _public.userMonthlyFixed) + (prevMonthlyFixed.userClose * pItemMonthlyFixed.delta);
          }

          console.log(pItemMonthlyFixed)
          _public.userMonthlyFixedData.push(pItemMonthlyFixed);

        });
      }
    },
    drawUserLine: function () {
      //_public.clearUserData()
      _public.calculateUserHeld();
      _public.render(_public.userHeld);

      _public.calculateUserSold();
      _public.render(_public.userSold);

    },
    drawMonthlyFixedLine: function() {
      _public.calculateMonthlyFixed();
      _public.render(_public.userMonthlyFixedData);

    },
    clearUserData: function() {
      // erase all userlines, re-render with default stock data
      dataSet = [];
      _public.render(_public.data);

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

      // todo - area ? https://github.com/mbostock/d3/wiki/Stack-Layout
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
        .style("stroke", color);

      // enter any new lines
      lines.enter()
        .append("path")
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", color)
        .on("mouseover", findValue);


      // exit
      lines.exit()
        .remove();

      // todo - numbers not responsive size
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + _private.height + ")")
        .attr("dx", ".71em")
        .call(xAxis);



      function color(d, i) {
        var colors = ["rgb(237, 76, 76)",
                      "rgb(169, 234, 136)",
                      "rgb(234, 218, 136)",
                      "rgb(136, 160, 234)"
                    ];

        return colors[i];
      }

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

        drawSelectionData(i, datapoint);

      }

      // only draw selection div once
      if (d3.selectAll(".selection")[0].length < 1) {
        selection = d3.select(".svg-container")
          .append("div")
          .attr("class", "selection")
          .style("opacity", 0);

        selectionContent = d3.select(".selection")
          .append("div")
          .attr("class", "selection-content");
      }

      function drawSelectionData(i, datapoint) {

        var whichClose;
        var dateFormat = d3.time.format("%Y/%m");

        // depending on line index define which close value to use
        if (i > 0) {
          whichClose = datapoint.userClose;
        } else {
          whichClose = datapoint.close;
        }


        selection
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("left", (d3.event.pageX) + "px");

        selectionContent
          .attr("style", function() {
              return "color:" + color(datapoint,i);
          })
          .html(numberFormat(whichClose) + "<br/>" + "<span style=\"font-size: 14px; letter-spacing: 0px;\">" + dateFormat(datapoint.date) + "</span>");


        if (_private.width - (d3.event.pageX + 150) < 0) {
          d3.select(".selection-content")
            .classed("left", true)
            .classed("right", false);

        } else {
          d3.select(".selection-content")
            .classed("right", true)
            .classed("left", false);
        }


      }



    }

  };

  return _public;

})();

// todo - separate draw axis, etc from the line(s)
d3Chart.get("/data")
  .then(d3Chart.processRaw)
  .then(d3Chart.render);
