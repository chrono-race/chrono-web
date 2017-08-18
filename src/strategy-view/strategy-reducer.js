import { fromJS } from 'immutable';
import * as types from '../actions/action-types';

const defaultState = fromJS({
  lapsUntilDriverStop: 21,
  lapsUntilOpponentStop: 21,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.UPDATE_DRIVER_STRATEGY:
      return state.set('lapsUntilDriverStop', action.lapsUntilStop);
    case types.UPDATE_OPPONENT_STRATEGY:
      return state.set('lapsUntilOpponentStop', action.lapsUntilStop);
    default:
      return state;
  }
};
