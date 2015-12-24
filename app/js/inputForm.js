var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return { stockHoldings: '' };

  },
  handleStockHoldingsChange: function(e) {

    this.setState({ stockHoldings: e.target.value });
  },
  handleSubmit: function(e) {
    console.log(e);
    e.preventDefault();
    var stockHoldings = this.state.stockHoldings.trim();
    if ( !stockHoldings ) {
      return;
    }
    // this.props.onCommentSubmit({ stockHoldings: stockHoldings });
    this.setState({ stockHoldings: stockHoldings });
  },
  render: function() {
    return (
      <form className="inputForm" onSubmit={ this.handleSubmit }>
        <input
          type="text"
          placeholder="Holdings"
          value={ this.state.stockHoldings }
          onChange={ this.handleStockHoldingsChange }
        />
        <input type="submit" value="Post" />
        <span> { this.state.stockHoldings } </span>
      </form>
    );
  }
});
