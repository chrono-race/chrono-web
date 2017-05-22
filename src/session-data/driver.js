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

export const newDriver = () => {
  return fromJS({ 
    laps: [],
    best: {
      s1Time: NaN,
      s2Time: NaN,
      s3Time: NaN,
      lapTime: NaN,
    }
  });
};

export const appendMessage = (driver, msg) => {
  let laps = driver.get('laps');
  let best = driver.get('best');
  while (laps.count() < msg.lapNumber) {
    laps = laps.push(fromJS(emptyLap(laps.count()+1)));
  }
  let lap = laps.get(msg.lapNumber-1);
  lap = lap.merge(msg);
  laps = laps.set(msg.lapNumber-1, lap);
  return fromJS({
    laps,
    best,
  });
};

export const findBests = (driver) => {
  let laps = driver.get('laps');
  return fromJS({
    laps,
    best: {
      s1Time: laps.map(l => l.get('s1Time')).filter(t => !isNaN(t)).min() || NaN,
      s2Time: laps.map(l => l.get('s2Time')).filter(t => !isNaN(t)).min() || NaN,
      s3Time: laps.map(l => l.get('s3Time')).filter(t => !isNaN(t)).min() || NaN,
      lapTime: laps.map(l => l.get('lapTime')).filter(t => !isNaN(t)).min() || NaN,
    }
  });
};
