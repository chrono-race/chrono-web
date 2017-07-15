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

function updateTime(existingTime, messages) {
  const msg = messages.reverse().find(x => x !== undefined);
  if (msg !== undefined) {
    return msg.time;
  }
  return existingTime;
}

function updateMessages(existingMessages, events) {
  let updatedMessages = existingMessages;
  events.forEach((e) => { updatedMessages = updatedMessages.update(m => m.push(fromJS(e))); });
  return updatedMessages;
}

function updateRaceName(existingRaceName, messages) {
  const msg = messages.find(x => x !== undefined);
  if (msg !== undefined) {
    return msg.name;
  }
  return existingRaceName;
}

function updateTotalLaps(existingTotalLaps, messages) {
  const msg = messages.find(x => x !== undefined);
  if (msg !== undefined) {
    return msg.totalLaps;
  }
  return existingTotalLaps;
}

function appendDriverMessage(drivers, msg) {
  let updatedDrivers = drivers;
  msg.drivers.forEach((d) => {
    let driver = updatedDrivers.get(d.tla);
    if (driver === undefined) {
      driver = newDriver();
    }
    driver = driver.set('color', `#${d.color}`)
              .set('number', d.number)
              .set('team', d.team)
              .set('tla', d.tla)
              .set('teamOrder', d.teamOrder);
    updatedDrivers = updatedDrivers.set(d.tla, driver);
  });

  return updatedDrivers;
}

function appendDriverMessages(drivers, driversMessages) {
  let updatedDrivers = drivers;
  driversMessages.forEach((msg) => {
    updatedDrivers = appendDriverMessage(updatedDrivers, msg);
  });
  return updatedDrivers;
}

function updateActive(active, messages) {
  return active || messages.length > 0;
}

function updateSecondsUntilConnect(initialValue, messages) {
  if (messages.length > 0) {
    return messages[messages.length - 1].remainingSec;
  }
  return initialValue;
}

const defaultSessionState = fromJS({
  drivers: {},
  best: {
    s1Time: NaN,
    s2Time: NaN,
    s3Time: NaN,
    lapTime: NaN,
  },
  time: NaN,
  messages: [],
  raceName: '',
  active: false,
  secondsUntilConnect: NaN,
  totalLaps: NaN,
});

export default (state = defaultSessionState, action) => {
  let startingState = state;
  if (action.type === types.BACKLOG_RECEIVED) {
    startingState = defaultSessionState;
  }

  if (action.type === types.BACKLOG_RECEIVED ||
    action.type === types.EVENTS_RECEIVED) {
    const updatedDrivers = appendDriverMessages(startingState.get('drivers'), action.messages.filter(m => m.type === 'drivers'));
    const backlogUpdatedDrivers = appendMessagesToDrivers(updatedDrivers,
      action.messages.filter(m => m.type === 'lap' || m.type === 'pit'));
    const updatedTime = updateTime(startingState.get('time'), action.messages.filter(m => m.type === 'time'));
    return startingState.set('drivers', backlogUpdatedDrivers)
      .set('best', findSessionBests(backlogUpdatedDrivers))
      .set('time', updatedTime)
      .set('messages', updateMessages(startingState.get('messages'), action.messages.filter(m => m.type === 'race_control_message')))
      .set('raceName', updateRaceName(startingState.get('raceName'), action.messages.filter(m => m.type === 'race_meta_data')))
      .set('totalLaps', updateTotalLaps(startingState.get('totalLaps'), action.messages.filter(m => m.type === 'race_meta_data')))
      .set('active', updateActive(startingState.get('active'), action.messages.filter(m => m.type !== 'waiting')))
      .set('secondsUntilConnect', updateSecondsUntilConnect(startingState.get('secondsUntilConnect'), action.messages.filter(m => m.type === 'waiting')));
  }

  return state;
};
