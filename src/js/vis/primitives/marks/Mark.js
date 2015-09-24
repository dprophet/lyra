var Primitive = require('../Primitive'),
    markID = 0;

function Mark(type) {
  this.name = type+'_'+(++markID);
  this.type = type;
  this.from = {};

  this.properties = {
    enter: {
      x: {value: 25},
      y: {value: 25},
      fill: {value: '#4682b4'},
      fillOpacity: {value: 1},
      stroke: {value: '#000000'},
      strokeWidth: {value: 0.25}
    }
  };

  return this;
}

var prototype = (Mark.prototype = Object.create(Primitive.prototype));
prototype.constructor = Mark;

// Vega spec that includes the current mark + its manipulators. We
// group them together within a group mark to keep things clean.
var MANIPULATORS = [{
  kind: 'handles',
  properties: {
    enter: {
      shape: {value: 'square'},
      stroke: {value: 'black'},
      strokeWidth: {value: 0.5}
    },
    update: {
      x: {field: 'x'},
      y: {field: 'y'},
      size: {value: 40},
      fill: {value: 'white'}
    }
  }
}];

prototype.manipulators = function() {
  var self = this, marks = [this.export()]
    .concat(MANIPULATORS.map(function(m) {
      return {
        type: 'symbol',
        from: {
          mark: self.name,
          transform: [{
            type: 'lyra.Manipulators.'+self.type,
            name: self.name,
            kind: m.kind
          }]
        },
        properties: m.properties
      }
    }));

  return {
    type: 'group',
    properties: {
      enter: {
        x: {value: 0},
        y: {value: 0},
        width: {field: {group: 'width'}},
        height: {field: {group: 'height'}}
      }
    },
    marks: marks
  };
};

module.exports = Mark;