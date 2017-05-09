import * as types from '../actions/action-types';

function emptyDriver() {
  return { laps: [] };
}

function appendMessagesToDrivers(drivers, messages) {
  messages.forEach(msg => {
    if (drivers[msg.driver] === undefined) {
      drivers[msg.driver] = emptyDriver();
    }
  });
  return drivers;
}

export default (state = {}, action) => {
  switch (action.type) {
    case types.BACKLOG_RECEIVED:
      return { drivers: appendMessagesToDrivers({}, action.messages) };
    default:
      return state;
  }
};
