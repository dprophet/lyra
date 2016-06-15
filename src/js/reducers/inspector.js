/* eslint new-cap:0 */
'use strict';

var Immutable = require('immutable');

var actions = require('../actions/Names');
var getIn = require('../util/immutable-utils').getIn;
var setIn = require('../util/immutable-utils').setIn;
var hierarchy = require('../util/hierarchy');

function expandLayers(state, layerIds) {
  return layerIds.reduce(function(newState, layerId) {
    return setIn(newState, 'expandedLayers.' + layerId, true);
  }, state);
}

function inspectorReducer(state, action) {
  if (typeof state === 'undefined') {
    return Immutable.fromJS({
      pipelines: {
        selected: null
      },
      selected: null,
      expandedLayers: {},
      scales: {
        selected: null,
        show: false
      }
    });
  }

  // Auto-select new marks
  if (action.type === actions.ADD_MARK) {
    // Select the mark, then attempt to auto-expand it (and its specified parent)
    return setIn(
      setIn(
        state.set('selected', action.id),
        'expandedLayers.' + action.id,
        true
      ),
      'expandedLayers.' + action.props._parent,
      true
    );
  }

  if (action.type === actions.SELECT_MARK) {
    var lookup = require('../model').lookup,
        parentGroupIds = hierarchy.getParentGroupIds(lookup(action.markId)),
        hideScalesState = setIn(state, 'scales.show', false);

    return expandLayers(hideScalesState.set('selected', action.markId), parentGroupIds);
  }

  if (action.type === actions.EXPAND_LAYERS) {
    return expandLayers(state, action.layerIds);
  }

  if (action.type === actions.REMOVE_LAYERS) {
    return action.layerIds.reduce(function(newState, layerId) {
      return newState.delete(layerId);
    }, state);
  }

  if (action.type === actions.TOGGLE_LAYERS) {
    return action.layerIds.reduce(function(newState, layerId) {
      var key = 'expandedLayers.' + layerId;
      return setIn(newState, key, !getIn(newState, key));
    }, state);
  }

  if (action.type === actions.SELECT_PIPELINE) {
    return setIn(state, 'pipelines.selected', action.id);
  }

  if (action.type === actions.SELECT_SCALE) {
    var selectedMarkState = setIn(state, 'selected', null);
    return setIn(selectedMarkState, 'scales.selected', action.id);
  }

  if (action.type === actions.SHOW_SCALE_INSPECTOR) {
    return setIn(state, 'scales.show', action.show);
  }

  return state;
}

module.exports = inspectorReducer;
