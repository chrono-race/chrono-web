import { fromJS } from 'immutable';
import * as types from '../actions/action-types';
import { newDriver, appendMessage, findBests } from './driver';

function appendMessagesToDrivers(drivers, messages) {
  let updatedDrivers = drivers;
  messages.forEach((msg) => {
    let driver = updatedDrivers.get(msg.driver);
    if (driver === undefined) {
      driver = newDriver();
    }
    driver = appendMessage(driver, msg);
    updatedDrivers = updatedDrivers.set(msg.driver, driver);
  });
  updatedDrivers.keySeq().forEach((name) => {
    let driver = updatedDrivers.get(name);
    driver = findBests(driver);
    updatedDrivers = updatedDrivers.set(name, driver);
  });
  return updatedDrivers;
}

function findSessionBests(drivers) {
  const s1Time = drivers.map(d => d.get('best').get('s1Time')).filter(t => !isNaN(t)).min() || NaN;
  const s2Time = drivers.map(d => d.get('best').get('s2Time')).filter(t => !isNaN(t)).min() || NaN;
  const s3Time = drivers.map(d => d.get('best').get('s3Time')).filter(t => !isNaN(t)).min() || NaN;
  const lapTime = drivers.map(d => d.get('best').get('lapTime')).filter(t => !isNaN(t)).min() || NaN;
  return fromJS({
    s1Time,
    s2Time,
    s3Time,
    lapTime,
  });
}

const defaultSessionState = fromJS({
  drivers: {},
  best: {
    s1Time: NaN,
    s2Time: NaN,
    s3Time: NaN,
    lapTime: NaN,
  },
});

export default (state = defaultSessionState, action) => {
  let startingState = state;
  if (action.type === types.BACKLOG_RECEIVED) {
    startingState = defaultSessionState;
  }

  if (action.type === types.BACKLOG_RECEIVED ||
    action.type === types.EVENTS_RECEIVED) {
    const backlogUpdatedDrivers = appendMessagesToDrivers(startingState.get('drivers'), action.messages);
    return startingState.set('drivers', backlogUpdatedDrivers)
      .set('best', findSessionBests(backlogUpdatedDrivers));
  }

  return state;
};
