var _       = require('lodash'),
    request = require('request'),
    fs      = require('fs');

var startDate = '2007-01-14',
    endDate = '2015-11-01',
    url = 'https://www.quandl.com/api/v3/datasets/YAHOO/INDEX_DJI.json?collapse=monthly&start_date='+ startDate +'&end_date=' + endDate,
    djiaStore = 'djia_start_date='+ startDate +'&end_date=' + endDate + '.json';


var data = {
  processData: function(rawData) {
    console.log('hi')
    var tmp = rawData.dataset.data;
  },
  get: function() {
    fs.stat(djiaStore, function(err, stat) {
      if (err === null) {
        console.log('exists: ' + djiaStore);
              console.log(processData());
      } else {
        request
          .get(url)
          .on('error', function(err) {
            console.log(err)
          })
          .on('response', function(response) {
            console.log(response.statusCode); // 200
          })
          .pipe(fs.createWriteStream(djiaStore));
      }

      // https://github.com/Olical/react-faux-dom
      // http://oli.me.uk/2015/09/09/d3-within-react-the-right-way/
      /*this.processData(require('./' + 'djia_start_date=2007-01-14&end_date=2015-11-01.json'));*/

    });
  }



};

data.get();

module.exports = data;
