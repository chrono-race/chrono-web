import { fromJS } from 'immutable';
import * as types from '../actions/action-types';

const defaultState = fromJS({
  driverLap: undefined,
  opponentLap: undefined,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.UPDATE_STRATEGIES:
      return state.set('driverLap', action.driverLap).set('opponentLap', action.opponentLap);
    default:
      return state;
  }
};
