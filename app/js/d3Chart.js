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
    buyDate: new Date("April 2009 00:00:00 GMT-0700 (PDT)"),
    userHeld: [],
    userSold: [],
    userDataInit: 1000,
    xTimeScale: d3.time.scale()
      .range([0, _private.width]),
    yTimeScale: d3.scale.linear()
      .range([_private.height, 0]),
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
    drawLineChart: function (rawData) {
      var margin = {
        top: 10,
        right: 0,
        bottom: 20,
        left: 0
      };

      var svg = d3.select("div#chart")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + parseInt(_private.width + margin.left + margin.right) + " " + parseInt(_private.height + margin.bottom + margin.top))
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      rawData = rawData.dataset.data.reverse();

      _public.data = rawData.map(function (d) {
        var pItem = [];
        pItem.date = _private.parseDate(d[0]);
        pItem.close = +d[4];
        return pItem;
      });

      var data = _public.data;

      var xAxis = d3.svg.axis()
        .scale(_public.xTimeScale)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(_public.yTimeScale)
        .orient("right")
        .ticks(5);




      var line = d3.svg.line()
        .x(function (d) {
          return _public.xTimeScale(d.date);
        })
        .y(function (d) {
          return _public.yTimeScale(d.close);
        });

      _public.xTimeScale.domain(d3.extent(data, function (d) {
        return d.date;
      }));

      _public.yTimeScale.domain([0, d3.max(data, function (d) {
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

    },
    drawUserLine: function () {

      var calculateUserHeld = function () {
        // console.log(userHold);

        // _public.userHeld = _.slice(_public.data);

        //  console.log(_public.userHeld);

        _public.userHeld = _public.data.map(function (d, i, a) {
          var prev = a[i - 1];
          if (!prev) {
            d.delta = 0;
            d.userClose = _public.userDataInit;
            return [d.date, d.delta, d.userClose];

            // _public.userHeld[i].slice(0,2, [d.date, d.delta, d.userClose]);
          } else {

            d.delta = (d.close - prev.close) / prev.close;
            d.userClose = +(prev.userClose + (prev.userClose * d.delta));
            // console.log(d.userClose)
            return [d.date, d.delta, d.userClose];

            // _public.userHeld[i].slice(0,2, [d.date, d.delta, d.userClose]);
          }

        });


      };

      if (!_public.data) {
        console.warn('rawData not processed');
      } else {

        calculateUserHeld();

      }
      // var userSold = _public.userData.slice();
      // console.log(userHeld)


      var calculateUserSold = function () {
        var holdValue;

        //_public.userSold = _.slice(_public.userHeld);

        _public.userSold = _public.userHeld.map(function (d, i, a) {

          var prev = a[i - 1];
          console.log(prev)
          console.log(d)

          if (d[0] >= _public.sellDate && d[0] <= _public.buyDate) {
            if (holdValue) {

              d[2] = holdValue;
              // console.log('if', i)
              // console.log(userHold[1][i][2]);
            } else {
              // console.log(userHold[1]);
              // console.log('else', i)

              holdValue = d[2];
            }

          } else if (d[0] >= _public.buyDate) {

            var userClose = +(prev[2] + (prev[2] * d[1]));
            return userClose
              //_public.userSold[i].splice(2, 1, userClose);
              //  console.log(_public.userSold[i]);
          }
        });
      };

      calculateUserSold();


      _public.render(_public.userHeld);
      // _public.render(_public.userSold);


    },
    render: function (data) {
      var margin = {
        top: 10,
        right: 0,
        bottom: 20,
        left: 0
      };
      var y1 = _public.yTimeScale;
      var yAxisRight = d3.svg.axis()
        .scale(y1)
        .orient("right")
        .ticks(5);

      // var found = _public.userData.indexOf
      var userLine = d3.svg.line()
        .x(function (d) {
          return _public.xTimeScale(d[0]);
        })
        .y(function (d) {
          return y1(d[2]);
        });

      y1.domain([0,
        d3.max(data, function (d) {
          return Math.max(d[2]);
        })
      ]);

      var existingLines = d3.selectAll("g#user-line");

      if (existingLines[0].length > 0) {
        existingLines.remove();
      }

      console.log(_public.userSold)
      console.log(_public.userHeld)

      var svg = d3.select("svg");
      svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "user-line")
        .append("g")
        .attr("class", "y axis")
        .call(yAxisRight)
        .append("path")
        .data(data)
        .attr("class", "user-line")
        .attr("d", userLine);

    }

  };

  return _public;


})();

// todo - separate draw axis, etc from the line(s)
d3Chart.get("/data")
  .then(d3Chart.drawLineChart);
