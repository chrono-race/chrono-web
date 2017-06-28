import offsetSlowLaps from './offset-slow-laps';

// lapIndex is lapNumber-1
function toLapNormalTime(time, lapIndex, best) {
  if (lapIndex > 0) {
    return time - (lapIndex * best);
  }
  return time;
}

function toDriverNormalTime(driver, best) {
  return driver.get('cumulativeTime').map((time, index) => toLapNormalTime(time, index, best));
}

function normaliseTimes(session) {
  const best = session.get('best').get('lapTime');
  const times = session.get('drivers').map(driver => toDriverNormalTime(driver, best));
  return offsetSlowLaps(times, best);
}

export default normaliseTimes;
