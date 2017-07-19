import * as types from '../actions/action-types';

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SOCKET_CONNECTED:
      return {
        socket: action.socket,
      };
    default:
      return state;
  }
};
