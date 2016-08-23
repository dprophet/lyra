'use strict';

var React = require('react'),
    Alternatives = require('./Alternatives'),
    SEL_TYPES = require('../../constants/selectionTypes');

var SelectionSuggestion = React.createClass({
  propTypes: {
    type: SEL_TYPES.isRequired,
  },

  headers: {
    point: (<h5>a <span className="type">single</span></h5>),
    list: (<h5><span className="type">multiple</span> different</h5>),
    interval: (<h5>an <span className="type">interval</span> of points</h5>)
  },

  eventName: function(event) {
    var type = event.get('type'),
        filters = event.get('filters');

    return filters.size === 0 ? type :
      filters.valueSeq().map(function(f) {
        return f.replace('event.', '').replace('Key', '');
      }).join('-') + '-' + type;
  },

  render: function() {
    var props = this.props,
        type = props.type;

    return (
      <div className="selection">
        {this.headers[type]}

        <Alternatives defKey="on" altKey="events"
          lede="on" label={this.eventName} {...props} />
      </div>
    );
  }
});

module.exports = SelectionSuggestion;
