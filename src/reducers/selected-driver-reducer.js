import * as types from '../actions/action-types';

export default (state = 'HAM', action) => {
  switch (action.type) {
    case types.SELECT_DRIVER:
      return action.driver;
    default:
      return state;
  }
};
