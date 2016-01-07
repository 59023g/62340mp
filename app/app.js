var React = require('react');
var UserInput = require('./js/userInput.js'); //this is the box component

var Component = React.createClass({
    render: function() {
        return (
            <html>
                <head>
                    <title>
                        App
                    </title>
                </head>
                <body>
                  <div id='app'>
                    <UserInput text='testing'/>
                  </div>
                  <script src="vendor.min.js"></script>
                </body>
            </html>
        );
    }
});

module.exports = Component;
