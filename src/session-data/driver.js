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
  while (laps.count() < msg.lapNumber) {
    laps = laps.push(fromJS(emptyLap(laps.count()+1)));
  }
  let lap = laps.get(msg.lapNumber-1);
  lap = lap.merge(msg);
  laps = laps.set(msg.lapNumber-1, lap);
  const best = {
    lapTime: laps.map(l => l.get('lapTime')).min() || NaN,
    s1Time: NaN,
    s2Time: NaN,
    s3Time: NaN,
  };
  return fromJS({
    laps,
    best,
  });
};
