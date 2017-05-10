import * as types from '../actions/action-types';
import driver from './driver';

function appendMessagesToDrivers(drivers, messages) {
  messages.forEach(msg => {
    if (drivers[msg.driver] === undefined) {
      drivers[msg.driver] = driver();
    }
    drivers[msg.driver].appendMessage(msg);
  });
  return drivers;
}

const defaultSessionState = {
  drivers: {},
};

export default (state = defaultSessionState, action) => {
  switch (action.type) {
    case types.BACKLOG_RECEIVED:
      return { drivers: appendMessagesToDrivers({}, action.messages) };
    case types.EVENTS_RECEIVED:
      return { drivers: appendMessagesToDrivers(state.drivers, action.messages)};
    default:
      return state;
  }
};
