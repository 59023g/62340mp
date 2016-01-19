var _       = require('lodash'),
    request = require('request'),
    fs      = require('fs'),
    q       = require('q');

var startDate = '2007-01-14',
    endDate = '2015-11-01',
    url = 'https://www.quandl.com/api/v3/datasets/YAHOO/INDEX_DJI.json?collapse=monthly&start_date='+ startDate +'&end_date=' + endDate,
    djiaStore = 'djia_start_date='+ startDate +'&end_date=' + endDate + '.json';


var data = {
  processData: function(rawData) {
    console.log('hi')
    // var tmp = rawData.dataset.data;
  },
  get: function() {
    var deferred = q.defer();
    fs.stat(djiaStore, function(err, stat) {
      if (err === null) {
        deferred.resolve('exists: ' + djiaStore)
      } else {
        request
          .get(url)
          .on('error', function(err) {
            deferred.reject(new Error(err))
          })
          .on('response', function(response) {
            deferred.resolve(response.statusCode);
          })
          .pipe(fs.createWriteStream(djiaStore));
      }

      // https://github.com/Olical/react-faux-dom
      // http://oli.me.uk/2015/09/09/d3-within-react-the-right-way/
    });
    return deferred.promise;

  }



};

data.get().then(data.processData());

module.exports = data;
