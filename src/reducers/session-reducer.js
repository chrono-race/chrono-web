import * as types from '../actions/action-types';

export default (state = {}, action) => {
  switch (action.type) {
    case types.BACKLOG_RECEIVED:
      return { drivers: {} };
    default:
      return state;
  }
};
