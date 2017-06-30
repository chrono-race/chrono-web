import leaderOnLap from './leader-on-lap';
import offsetTimes from './offset-times';
import median from './median';

function getLeaderLapTime(lapNumber, times) {
  const leader = leaderOnLap(times, lapNumber);
  const leaderLaps = times.get(leader);
  const prevLap = leaderLaps.get(lapNumber - 1);
  const thisLap = leaderLaps.get(lapNumber);
  const lapTime = thisLap - prevLap;
  return lapTime;
}

function total(slowLaps) {
  let count = 0;
  slowLaps.forEach((l) => { count += l; });
  return count;
}

function offsetSlowLaps(times) {
  let updatedTimes = times;

  const maxLaps = updatedTimes.map(driver => driver.count()).max();
  if (maxLaps === undefined) {
    return times;
  }
  const leaderLaps = [...Array(maxLaps).keys()]
    .filter((v, i) => i > 0)
    .map(lapNumber => getLeaderLapTime(lapNumber, times));
  const medianLap = median(leaderLaps.sort());
  const slowLaps = leaderLaps.filter(l => l > medianLap * 1.3);

  const leaderFinishTime = updatedTimes.get(leaderOnLap(times, maxLaps - 1)).get(maxLaps - 1);
  const typicalLap = (leaderFinishTime - total(slowLaps)) / (maxLaps - 1 - slowLaps.length);

  for (let lap = 1; lap < maxLaps; lap++) { // eslint-disable-line no-plusplus
    const leader = leaderOnLap(updatedTimes, lap);
    const lapTimes = updatedTimes.get(leader);
    const prevLap = lapTimes.get(lap - 1);
    const thisLap = lapTimes.get(lap);
    const lapTime = thisLap - prevLap;

    const newLap = typicalLap;

    if (lapTime > medianLap * 1.3) {
      updatedTimes = offsetTimes(updatedTimes, thisLap, lapTime - newLap);
    }
  }

  return updatedTimes;
}

export default offsetSlowLaps;
