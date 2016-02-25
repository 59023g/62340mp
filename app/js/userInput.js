var React = require('react'),
    d3Chart = {};
// todo - create global user {} for state
// *** abstract as generic input field ***
var userInput = module.exports = React.createClass({
  getInitialState: function() {
    return {
      stockHoldings: '',
      isNumber: false
    };
  },
  handleStockHoldingsChange: function(e, i) {
    // todo - check out React.PropTypes to check type
    // todo - parseInt if lead
    console.log(e.target.value, e, i)
    if (!Number(e.target.value)) {
      this.setState({
        isNumber: false,
        stockHoldings: ''
      });
      return;
    }
    this.setState({
      isNumber: true,
      stockHoldings: e.target.value
    });

  },
  handleSubmit: function(e) {
    e.preventDefault();
    var stockHoldings = parseInt(this.state.stockHoldings.trim());
    if (!stockHoldings) {
      return;
    } else if ( d3Chart ) {
      d3Chart.userDataInit = stockHoldings;
      d3Chart.userData = [];
      d3Chart.drawUserLine();
    }

    this.setState({
      stockHoldings: stockHoldings
    });

    // todo - post for server state sync
  },
  componentDidMount: function() {
    d3Chart = require('./d3Chart.js');
    console.log(d3Chart);
  },
  // not JSX: React.createElement('a', {href: 'https://facebook.github.io/react/'}, 'Hello!')
  // var child1 = React.createElement('li', null, 'First Text Content');
  // var child2 = React.createElement('li', null, 'Second Text Content');
  // var root = React.createElement('ul', { className: 'my-list' }, child1, child2);
  // JSX:
  render: function() {
    return (

      < form className = "inputForm"
        onSubmit = { this.handleSubmit } >
        < input type = "text"
          placeholder = "Total Equity Holdings"
          className= "inputForm"
          value = { this.state.stockHoldings }
          onChange = { this.handleStockHoldingsChange }
        />
        < input type = "text"
          placeholder = "Monthly Fixed Investment"
          className= "inputForm"
          value = { this.state.fixedInvestment }
          onChange = { this.handleStockHoldingsChange }
        />
        < input type = "submit"
          name = "stockHoldings"
          className = "inputSubmit stockHoldings"
          value = "Post"
          disabled = { !this.state.isNumber }
        />
        < input type = "submit"
          name = "monthlyFixed"
          className = "inputSubmit monthlyFixed"
          value = "Post"
          disabled = { !this.state.isNumber }
        />
      < /form>
    );
  }
});

module.exports = userInput;
