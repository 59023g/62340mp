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
                    <InputForm text='testing'/>
                    <script src="vendor.min.js"></script>
                </body>
            </html>
        );
    }
});

module.exports = Component;
