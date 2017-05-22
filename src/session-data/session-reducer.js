import { fromJS } from 'immutable';
import * as types from '../actions/action-types';
import { newDriver, appendMessage, findBests } from './driver';

function appendMessagesToDrivers(drivers, messages) {
  let updatedDrivers = drivers;
  messages.forEach(msg => {
    let driver = updatedDrivers.get(msg.driver);
    if (driver === undefined) {
      driver = newDriver();
    }
    driver = appendMessage(driver, msg);
    updatedDrivers = updatedDrivers.set(msg.driver, driver);
  });
  updatedDrivers.keySeq().forEach(name => {
    let driver = updatedDrivers.get(name);
    driver = findBests(driver);
    updatedDrivers = updatedDrivers.set(name, driver);
  });
  return updatedDrivers;
}

const defaultSessionState = fromJS({
  drivers: {},
  best: {
    s1Time: NaN,
    s2Time: NaN,
    s3Time: NaN,
    lapTime: NaN,
  }
});

export default (state = defaultSessionState, action) => {
  switch (action.type) {
    case types.BACKLOG_RECEIVED:
      return state.set('drivers', appendMessagesToDrivers(fromJS({}), action.messages));
    case types.EVENTS_RECEIVED:
      return state.set('drivers', appendMessagesToDrivers(state.get('drivers'), action.messages));
    default:
      return state;
  }
};
