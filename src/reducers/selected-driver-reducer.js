import { fromJS } from 'immutable';
import * as types from '../actions/action-types';

const defaultState = fromJS({
  selectedDriver: '',
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SELECT_DRIVER:
      return state.set('selectedDriver', action.driver);
    case types.SELECT_OPPONENT:
      return state.set('selectedOpponent', action.driver);
    default:
      return state;
  }
};
