import { fromJS } from 'immutable';
import * as types from '../actions/action-types';

const defaultState = fromJS({
  selectedTab: 'fuel',
  selectedTyre: '',
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SELECT_MODEL_TAB:
      return state.set('selectedTab', action.tab);
    case types.SELECT_MODEL_TYRE:
      return state.set('selectedTyre', action.tyre);
    default:
      return state;
  }
};

