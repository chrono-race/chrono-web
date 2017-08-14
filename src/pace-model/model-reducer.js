import { fromJS } from 'immutable';
import * as types from '../actions/action-types';

const defaultState = fromJS({
  selectedTyre: '',
  showModelHelp: false,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SELECT_MODEL_TYRE:
      return state.set('selectedTyre', action.tyre);
    case types.TOGGLE_MODEL_HELP:
      return state.set('showModelHelp', !state.get('showModelHelp'));
    default:
      return state;
  }
};

