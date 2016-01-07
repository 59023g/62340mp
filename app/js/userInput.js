var React = require('react');
var _ = require('lodash');

// todo - create global user {} for state

var userInput = module.exports = React.createClass({
  getInitialState: function() {
    return {
      stockHoldings: '',
      isNumber: false
    };
  },
  handleStockHoldingsChange: function(e) {
    // todo - check out React.PropTypes to check type
    // todo - parseInt if lead
    console.log(Number(e.target.value));
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
    var stockHoldings = this.state.stockHoldings.trim();
    if (!stockHoldings) {
      return;
    }
    // this.props.onCommentSubmit({ stockHoldings: stockHoldings });
    this.setState({
      stockHoldings: stockHoldings
    });
  },
  componentDidMount: function() {
    console.log(this.state);
  },
  // not JSX: React.createElement('a', {href: 'https://facebook.github.io/react/'}, 'Hello!')
  // var child1 = React.createElement('li', null, 'First Text Content');
  // var child2 = React.createElement('li', null, 'Second Text Content');
  // var root = React.createElement('ul', { className: 'my-list' }, child1, child2);
  // JSX:
  render: function() {
    return ( < form className = "inputForm"
      onSubmit = {
        this.handleSubmit
      } >
      < input type = "text"
      placeholder = "Holdings"
      value = {
        this.state.stockHoldings
      }
      onChange = {
        this.handleStockHoldingsChange
      }
      /> < input type = "submit"
      value = "Post"
      disabled = {
        !this.state.isNumber
      }
      /> < span className = {
        this.state.isNumber ? 'hide' : null
      } > Must be a number. < /span> < /form>
    );
  }
});

module.exports = userInput;
