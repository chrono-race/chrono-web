import offsetSlowLaps from './offset-slow-laps';
import leaderOnLap from './leader-on-lap';

// lapIndex is lapNumber-1
function toLapNormalTime(time, lapIndex, best) {
  if (lapIndex > 0) {
    return time - (lapIndex * best);
  }
  return time;
}

function toDriverTimeStructure(driver) {
  return driver.get('cumulativeTime');
}

function toTimeStructure(session) {
  return session.get('drivers').map(driver => toDriverTimeStructure(driver));
}

function toDriverNormalTime(driverTimes, normalLap) {
  return driverTimes.map((time, index) => toLapNormalTime(time, index, normalLap));
}

function findLeaderAverageLap(times) {
  const lastLapIndex = times.map(driver => driver.findLastIndex(t => !isNaN(t))).max();
  if (lastLapIndex === undefined) {
    return undefined;
  }
  const leader = leaderOnLap(times, lastLapIndex);
  const leaderTime = times.get(leader).get(lastLapIndex);
  return leaderTime / lastLapIndex;
}

function normaliseTimes(session) {
  const times = toTimeStructure(session);
  const noSlowLaps = offsetSlowLaps(times);
  const normalLap = findLeaderAverageLap(noSlowLaps);
  return noSlowLaps.map(driverTimes => toDriverNormalTime(driverTimes, normalLap));
}

export default normaliseTimes;
