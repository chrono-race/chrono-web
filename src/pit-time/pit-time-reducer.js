import { fromJS } from 'immutable';
import * as types from '../actions/action-types';

const defaultState = fromJS({
  sortByColumn: 'timeLost',
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SORT_PIT_TIME:
      return state.set('sortByColumn', action.column);
    default:
      return state;
  }
};

