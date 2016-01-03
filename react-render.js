var React = require('react');
var Box = require('./app/js/box.js'); //this is the box component

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
                    <Box text='testing'/>
                    <script src="vendor.min.js"></script>
                </body>
            </html>
        );
    }
});

module.exports = Component;
