var React = require('react');
var _ = require('lodash');


module.exports = React.createClass({
    getInitialState: function() {
      return {
        stockHoldings: '',
        isNumber: false
      };
    },
    handleStockHoldingsChange: function(e) {
      // todo - check out React.PropTypes to check type
      // todo - parseInt if lead
      console.log(Number( e.target.value )  )
      if ( !Number( e.target.value ) ) {
        this.setState({ isNumber: false, stockHoldings: '' });
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
    render: function() {
      return (
        < form className = "inputForm" onSubmit = { this.handleSubmit  } >
          < input
            type        = "text"
            placeholder = "Holdings"
            value       = { this.state.stockHoldings }
            onChange    = { this.handleStockHoldingsChange }
          />
          < input
            type        = "submit"
            value       = "Post"
            disabled    = { !this.state.isNumber }
          />
          < span className={ this.state.isNumber ? 'hide' : null }> Must be a number. < /span>
        < /form>
      );
    }
});
