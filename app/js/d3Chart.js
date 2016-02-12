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

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

var svg = d3.select("div#chart")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + parseInt(_private.width + margin.left + margin.right) + " " + parseInt(_private.height + margin.bottom + margin.top))
  .classed("svg-content-responsive", true)
  .append("g")
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
        // _public.render(_public.userHeld);
      _public.calculateUserSold();
      // _public.render(_public.userSold);

      var masterArray = [_public.userHeld, _public.userSold, _public.data];
      _public.render(masterArray);

    },
    render: function (data) {

      // console.log(data)

      var yScale = d3.scale.linear()
        .range([_private.height, 0]);

      xScale.domain(d3.extent(data, function (d) {
        return d.date;
      }));

      yScale.domain([0, d3.max(data, function (d) {
        if (d.userClose) {
          return d.userClose;
        } else {
          return d.close;
        }
      })]);

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


      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(5);

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

      var lines = svg.append("path");

      svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .enter()
          .append("path")
          .attr("class", "line")
          .attr("d", line);

      console.log(svg.selectAll(".line"));


      svg.selectAll(".y.axis")
        .remove();
      svg.selectAll(".x.axis")
        .remove();

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

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
// d3Chart.render2(data);
