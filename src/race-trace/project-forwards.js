
function driverLapCount(driver) {
  return driver.findLastIndex(t => !isNaN(t)) + 1;
}

function leaderLap(times) {
  return times.map(driver => driverLapCount(driver)).max();
}

function lapTime(times, lapIndex) {
  return times.get(lapIndex) - times.get(lapIndex - 1);
}

function findNextDriver(times) {
  const driverTimes = times.map(driver => driver.filter(t => !isNaN(t)).max());
  const nextTime = driverTimes.minBy(time => time);
  const nextDriver = driverTimes.findEntry(time => time === nextTime)[0];
  return nextDriver;
}

function projectDriverLap(driverTimes, driver) {
  const lapCount = driverLapCount(driverTimes);
  const stintStartLaps = driver.get('stints').map(stint => stint.get('startLap'));
  const lastLaps = [...Array(5).keys()]
    .map(i => lapCount - 1 - i)
    .filter(i => i > 0)
    .filter(i => !stintStartLaps.contains(i + 1) && !stintStartLaps.contains(i + 2))
    .map(i => lapTime(driverTimes, i));

  const averageLapTime = lastLaps.reduce((a, b) => a + b, 0) / lastLaps.length;

  return driverTimes.get(lapCount - 1) + averageLapTime;
}

function projectForwards(times, drivers, addLaps) {
  const lastLapIndex = leaderLap(times);
  if (lastLapIndex === undefined) {
    return times;
  }

  const desiredLeaderLapCount = lastLapIndex + addLaps;

  let updatedTimes = times;
  for (let i = 0; i < 10; i++) {
    const nextDriver = findNextDriver(updatedTimes);
    const driverLaps = driverLapCount(updatedTimes.get(nextDriver));
    if (driverLaps >= desiredLeaderLapCount) {
      break;
    }
    const driverNextLap = projectDriverLap(updatedTimes.get(nextDriver), drivers.get(nextDriver));
    const updatedDriverTimes = updatedTimes.get(nextDriver).set(driverLaps, driverNextLap);
    updatedTimes = updatedTimes.set(nextDriver, updatedDriverTimes);
  }

  return updatedTimes;
}

export default projectForwards;
