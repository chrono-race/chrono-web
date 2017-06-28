import offsetSlowLaps from './offset-slow-laps';
import getNormalLaptime from './get-normal-laptime';

// lapIndex is lapNumber-1
function toLapNormalTime(time, lapIndex, best) {
  if (lapIndex > 0) {
    return time - (lapIndex * best);
  }
  return time;
}

function toDriverNormalTime(driver, normalLap) {
  return driver.get('cumulativeTime').map((time, index) => toLapNormalTime(time, index, normalLap));
}

function normaliseTimes(session) {
  const normalLap = getNormalLaptime(session);
  const times = session.get('drivers').map(driver => toDriverNormalTime(driver, normalLap));
  return offsetSlowLaps(times, normalLap);
}

export default normaliseTimes;
