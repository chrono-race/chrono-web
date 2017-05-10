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

export default (state = {}, action) => {
  switch (action.type) {
    case types.BACKLOG_RECEIVED:
      return { drivers: appendMessagesToDrivers({}, action.messages) };
    default:
      return state;
  }
};
