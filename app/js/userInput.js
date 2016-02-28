var React = require('react'),
    d3Chart = {};
// todo - create global user {} for state
// *** abstract as generic input field *** but not sure how i feel about React...

var userInput = module.exports = React.createClass({
  getInitialState: function() {
    return {
      monthlyFixed: {
        value: '',
        isNumber: false
      },
      equityHoldings: {
        value: '',
        isNumber: false
      }
    };
  },
  handleChange: function(e, i, l, f, j) {

    var getFormName = e.target.form.name;

    // todo - compress this... literal eval?
    if (getFormName === "equityHoldings") {
      if (!Number(e.target.value)) {
        this.setState({
          equityHoldings: {
            value: '',
            isNumber: false
          }
        });
        return;
      }
      this.setState({
        equityHoldings: {
          value: e.target.value,
          isNumber: true
        }
      });
    }

    if (getFormName === "monthlyFixed") {
      if (!Number(e.target.value)) {
        this.setState({
          monthlyFixed: {
            value: '',
            isNumber: false
          }
        });
        return;
      }
      this.setState({
        monthlyFixed: {
          value: e.target.value,
          isNumber: true
        }
      });

    }
  },
  handleSubmit: function(e) {
    var getFormName = e.target.name;

    e.preventDefault();
    var equityHoldings = parseInt(this.state.equityHoldings.value.trim());
    var monthlyFixed = parseInt(this.state.monthlyFixed.value.trim());

    if (!equityHoldings && !monthlyFixed) {
      return;
    } else if ( getFormName === "equityHoldings" && d3Chart ) {
      d3Chart.userEquityHoldings = equityHoldings;
      d3Chart.userData = [];
      d3Chart.drawUserLine();
    } else if (getFormName === "monthlyFixed" && d3Chart ) {

      console.log(monthlyFixed)
    }



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
          name = "equityHoldings"
          onSubmit = { this.handleSubmit } >

          <input
            type = "text"
            placeholder = "Total Equity Holdings"
            className= "inputForm"
            value = { this.state.equityHoldings.value }
            onChange = { this.handleChange }
          />

          <input
            type = "submit"
            id = "equityHoldings"
            className = "inputSubmit"
            value = "Render"
            disabled = { !this.state.equityHoldings.isNumber }
          />

        </form>

        <form
          name = "monthlyFixed"
          onSubmit = { this.handleSubmit } >

          <input
            type = "text"
            placeholder = "Monthly Fixed Investment"
            className= "inputForm"
            value = { this.state.monthlyFixed.value }
            onChange = { this.handleChange }
          />

          <input
            type = "submit"
            id = "monthlyFixed  "
            className = "inputSubmit"
            value = "Render"
            disabled = { !this.state.monthlyFixed.isNumber }
          />

        </form>

      </div>
    );
  }
});

module.exports = userInput;
