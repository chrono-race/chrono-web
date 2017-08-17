import getLeaderLapTime from './leader-lap-time';
import median from './median';

function addLapBeforeEachSlowLap(lapNumbers) {
  const result = [];
  lapNumbers.forEach((lapNumber) => {
    if (lapNumber > 1 && lapNumbers.find(l => l === lapNumber - 1) === undefined) {
      result.push(lapNumber - 1);
    }
    result.push(lapNumber);
  });
  return result;
}

function findSlowLapNumbers(times) {
  const lastLapIndex = times.map(driver => driver.findLastIndex(t => !isNaN(t))).max();

  const leaderLaps = [...Array(lastLapIndex + 1).keys()]
    .filter((v, i) => i > 0)
    .map(lapNumber => getLeaderLapTime(lapNumber, times));
  const medianLap = median(leaderLaps.sort((a, b) => a - b));

  return addLapBeforeEachSlowLap([...Array(lastLapIndex + 1).keys()]
    .filter((v, i) => i > 0)
    .filter(lapNumber => getLeaderLapTime(lapNumber, times) > medianLap * 1.3));
}

export default findSlowLapNumbers;
