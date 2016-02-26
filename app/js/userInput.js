var React = require('react'),
    d3Chart = {};
// todo - create global user {} for state
// *** abstract as generic input field *** but not sure how i feel about React...

var userInput = module.exports = React.createClass({
  getInitialState: function() {
    return {
      monthlyFixed: '',
      equityHoldings: '',
      isNumber: false
    };
  },
  handleChange: function(e, i) {

    if (!Number(e.target.value)) {
      this.setState({
        isNumber: false,
        equityHoldings: ''
      });
      return;
    }
    this.setState({
      isNumber: true,
      equityHoldings: e.target.value
    });

  },
  handleSubmit: function(e) {

    console.log(e);
    e.preventDefault();
    var equityHoldings = parseInt(this.state.equityHoldings.trim());
    if (!equityHoldings) {
      return;
    } else if ( d3Chart ) {
      d3Chart.userDataInit = equityHoldings;
      d3Chart.userData = [];
      d3Chart.drawUserLine();
    }

    this.setState({
      equityHoldings: equityHoldings
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
      <div>
        <form
          className = "inputForm "
          name = "equityHoldings"
          onSubmit = { this.handleSubmit } >

          <input
            type = "text"
            placeholder = "Total Equity Holdings"
            className= "inputForm"
            value = { this.state.equityHoldings }
            onChange = { this.handleChange }
          />

          <input
            type = "submit"
            id = "equityHoldings"
            name = "equityHoldings"
            className = "inputSubmit"
            value = "Post"
            disabled = { !this.state.isNumber }
          />

        </form>

        <form
          className = "inputForm"
          onSubmit = { this.handleSubmit } >

          <input
            type = "text"
            placeholder = "Monthly Fixed Investment"
            className= "inputForm"
            value = { this.state.monthlyFixed }
            onChange = { this.handleChange }
          />

          <input
            type = "submit"
            id = "monthlyFixed  "
            name = "monthlyFixed"
            className = "inputSubmit"
            value = "Post"
            disabled = { !this.state.isNumber }
          />

        </form>

      </div>
    );
  }
});

module.exports = userInput;
