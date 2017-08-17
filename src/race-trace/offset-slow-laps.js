import offsetTimes from './offset-times';
import getLeaderLapTime from './leader-lap-time';
import leaderOnLap from './leader-on-lap';

function total(slowLaps) {
  let count = 0;
  slowLaps.forEach((l) => { count += l; });
  return count;
}

function offsetSlowLaps(times, slowLapNumbers) {
  let updatedTimes = times;

  const lastLapIndex = updatedTimes.map(driver => driver.findLastIndex(t => !isNaN(t))).max();
  if (lastLapIndex === undefined) {
    return times;
  }

  const slowLaps = slowLapNumbers.map(lapNumber => getLeaderLapTime(lapNumber, times));

  const leaderFinishTime = updatedTimes.get(leaderOnLap(times, lastLapIndex)).get(lastLapIndex);
  const typicalLap = (leaderFinishTime - total(slowLaps)) / (lastLapIndex - slowLaps.length);

  for (let lap = 1; lap <= lastLapIndex; lap++) { // eslint-disable-line no-plusplus
    const leader = leaderOnLap(updatedTimes, lap);
    const lapTimes = updatedTimes.get(leader);
    const prevLap = lapTimes.get(lap - 1);
    const thisLap = lapTimes.get(lap);
    const lapTime = thisLap - prevLap;

    const newLap = typicalLap;

    if (slowLapNumbers.find(l => l === lap) !== undefined) {
      updatedTimes = offsetTimes(updatedTimes, thisLap, lapTime - newLap);
    }
  }

  return updatedTimes;
}

export default offsetSlowLaps;
