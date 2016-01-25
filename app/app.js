var React = require('react');
var UserInput = require('./js/userInput.js'); //this is the box component

var Component = React.createClass({
    render: function() {
        return (
            <html>
                <head>
                <link rel="stylesheet" href="css.css"/>
                    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                    <title>
                        App
                    </title>
                </head>
                <body>
                  <div id='app'>
                    <UserInput text='testing'/>

                  </div>
                  <div id='chart'></div>
                  <script src="vendor.min.js"></script>
                </body>
            </html>
        );
    }
});

module.exports = Component;
