var d3 = require('d3'),
  fs = require('fs'),
  _ = require('lodash'),
  q = require('q');
// todo - pre-render chart on server :/
// rawData = require('../../processData.js'),
// ReactFauxDom = require('react-faux-dom');

var d3Chart = {
  data: {},
  get: function(url) {

    function d3Promise(context) {
      return function() {
        return new Promise(function( resolve, reject ) {
          var callback = function( err, data) {
            if ( err ) {
              reject(new Error( err ));
              return;
            }
            context.data = data;
            resolve( context.data );
          };
        });
      };
    }



    d3.json( url, d3Promise(this)  );


  }

};


d3Chart.get("/data");



module.exports = d3Chart;
