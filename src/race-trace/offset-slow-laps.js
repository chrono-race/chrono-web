import leaderOnLap from './leader-on-lap';
import offsetTimes from './offset-times';

function offsetSlowLaps(times, best) {
  let updatedTimes = times;

  const maxLaps = updatedTimes.map(driver => driver.count()).max();

  for (let lap = 1; lap < maxLaps; lap++) {
    const leader = leaderOnLap(updatedTimes, lap);
    const leaderLaps = updatedTimes.get(leader);
    const prevLap = leaderLaps.get(lap - 1);
    const thisLap = leaderLaps.get(lap);
    const lapTime = thisLap - prevLap;
    if (lapTime > best * 0.3) {
      updatedTimes = offsetTimes(updatedTimes, thisLap, lapTime);
    }
  }

  return updatedTimes;
}

export default offsetSlowLaps;
