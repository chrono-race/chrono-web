import * as types from '../actions/action-types';

function emptyDriver() {
  return { laps: [] };
}

function appendMessageToDriver(driver, msg) {
  if (driver.laps.length < msg.lapNumber) {
    driver.laps.push({});
  }
  driver.laps[msg.lapNumber-1] = Object.assign(driver.laps[msg.lapNumber-1], msg);
}

function appendMessagesToDrivers(drivers, messages) {
  messages.forEach(msg => {
    if (drivers[msg.driver] === undefined) {
      drivers[msg.driver] = emptyDriver();
    }
    appendMessageToDriver(drivers[msg.driver], msg);
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
