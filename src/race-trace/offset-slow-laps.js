import leaderOnLap from './leader-on-lap';
import offsetTimes from './offset-times';

function offsetSlowLaps(times) {
  let updatedTimes = times;

  const maxLaps = updatedTimes.map(driver => driver.count()).max();

  for (let lap = 1; lap < maxLaps; lap++) {
    const leader = leaderOnLap(updatedTimes, lap);
    const leaderLaps = updatedTimes.get(leader);
    const prevLap = leaderLaps.get(lap - 1);
    const thisLap = leaderLaps.get(lap);
    const lapTime = thisLap - prevLap;
    const leaderLapCount = leaderLaps.count();
    const leaderTotal = leaderLaps.get(leaderLapCount - 1);

    const newLap = (leaderTotal - lapTime) / (leaderLapCount - 2);

    if (lapTime > newLap * 1.3) {
      updatedTimes = offsetTimes(updatedTimes, thisLap, lapTime - newLap);
    }
  }

  return updatedTimes;
}

export default offsetSlowLaps;
