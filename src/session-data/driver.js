import { fromJS } from 'immutable';

function emptyLap(lapNumber) {
  return {
    lapNumber,
    lapTime: NaN,
    gap: NaN,
    interval: NaN,
    position: NaN,
    s1Time: NaN,
    s2Time: NaN,
    s3Time: NaN,
    speed1: NaN,
    speed2: NaN,
    speed3: NaN,
    speedTrap: NaN,
    timestamp: NaN,
  };
}

export const newDriver = () => (fromJS({
  laps: [],
  best: {
    s1Time: NaN,
    s2Time: NaN,
    s3Time: NaN,
    lapTime: NaN,
  },
  currentStatus: '',
  stints: [],
  cumulativeTime: [],
}));

function appendLapMessage(driver, msg) {
  let laps = driver.get('laps');
  while (laps.count() < msg.lapNumber) {
    laps = laps.push(fromJS(emptyLap(laps.count() + 1)));
  }
  let lap = laps.get(msg.lapNumber - 1);
  lap = lap.merge(msg);
  laps = laps.set(msg.lapNumber - 1, lap);
  return driver.set('laps', laps);
}

function appendPitMessage(driver, msg) {
  return driver.set('currentStatus', msg.currentStatus).set('stints', fromJS(msg.stints));
}

function gapOrZero(gap) {
  if (gap === undefined || isNaN(gap) || gap === null) {
    return 0;
  }
  if (gap < 0) {
    return NaN;
  }
  return gap;
}

function recalculateCumulativeTime(driver) {
  let time = 0;
  return driver.get('laps').map((lap) => {
    if (lap.get('lapNumber') === 1) {
      time = gapOrZero(lap.get('gap'));
      return time;
    }
    const nextLapTime = lap.get('lapTime');
    if (nextLapTime > 0) {
      time += nextLapTime;
    } else {
      time = NaN;
    }
    return time;
  });
}

export const appendMessage = (driver, msg) => {
  if (msg.type === 'lap') {
    const updatedDriver = appendLapMessage(driver, msg);
    return updatedDriver.set('cumulativeTime', recalculateCumulativeTime(updatedDriver));
  } else if (msg.type === 'pit') {
    return appendPitMessage(driver, msg);
  }
  throw new Error(`unknown type: ${msg.type}`);
};

export const findBests = (driver) => {
  const laps = driver.get('laps');
  return driver.set('best', fromJS({
    s1Time: laps.map(l => l.get('s1Time')).filter(t => t !== null && !isNaN(t)).min() || NaN,
    s2Time: laps.map(l => l.get('s2Time')).filter(t => t !== null && !isNaN(t)).min() || NaN,
    s3Time: laps.map(l => l.get('s3Time')).filter(t => t !== null && !isNaN(t)).min() || NaN,
    lapTime: laps.map(l => l.get('lapTime')).filter(t => t !== null && !isNaN(t)).min() || NaN,
  }));
};
