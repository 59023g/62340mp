var React = require('react');
var InputForm = require('./app/js/inputForm.js'); //this is the box component

var Component = React.createClass({
    render: function() {
        return (
            <html>
                <head>
                    <title>
                        React Server Rendering
                    </title>
                </head>
                <body>
                  <div id='app'>
                    <InputForm text='testing'/>
                  </div>
                  <script src="vendor.min.js"></script>
                </body>
            </html>
        );
    }
});

module.exports = Component;
