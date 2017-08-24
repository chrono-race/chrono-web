import { fromJS } from 'immutable';

function driverLapCount(driver) {
  return driver.filter(t => !isNaN(t)).count();
}

function leaderLap(times) {
  return times.map(driver => driverLapCount(driver) + 1).max();
}

function lapTime(times, lapIndex) {
  return times.get(lapIndex) - times.get(lapIndex - 1);
}

function findNextDriver(times, minLapCount) {
  const driverTimes = times
    .filter(driver => driverLapCount(driver) > 1 && driverLapCount(driver) >= minLapCount)
    .map(driver => driver.filter(t => !isNaN(t)).max());
  const nextTime = driverTimes.filter(time => !isNaN(time)).minBy(time => time);
  const driverWithNextTime = driverTimes.findEntry(time => time === nextTime);
  if (driverWithNextTime === undefined) {
    return undefined;
  }
  return driverWithNextTime[0];
}

function projectDriverLap(driverTimes, driver, driverFuturePitLap, pitModelParams, slowLapNumbers) {
  const lapCount = driverLapCount(driverTimes);
  const stintStartLaps = driver.get('stints').map(stint => stint.get('startLap'));
  const lastLaps = [...Array(5).keys()]
    .map(i => lapCount - 1 - i)
    .filter(i => i > 0)
    .filter(i => !stintStartLaps.contains(i + 1) &&
                  !stintStartLaps.contains(i + 2) &&
                  i + 1 !== driverFuturePitLap &&
                  slowLapNumbers.find(x => x === i + 1) === undefined)
    .map(i => lapTime(driverTimes, i));

  let averageLapTime = lastLaps.reduce((a, b) => a + b, 0) / lastLaps.length;

  if (lapCount + 1 === driverFuturePitLap) {
    return driverTimes.get(lapCount - 1) + averageLapTime + pitModelParams.timeLostInPits;
  }

  if (lapCount + 1 > driverFuturePitLap) {
    const lapsSincePitstop = lapCount - driverFuturePitLap;
    const lapsUsedForAverage = lastLaps.length;

    if (lapsSincePitstop < lapsUsedForAverage) {
      const delta = (pitModelParams.newTyreLaptimeDelta * (lapsUsedForAverage - lapsSincePitstop)) /
                      lapsUsedForAverage;
      averageLapTime += delta;
    }
  }

  return driverTimes.get(lapCount - 1) + averageLapTime;
}

function projectForwards(times, drivers, addLaps, pitStops, pitModelParams, slowLapNumbers) {
  const lastLapIndex = leaderLap(times);
  if (lastLapIndex === undefined) {
    return times;
  }

  const pitStopLaps = fromJS(pitStops)
    .map(deltaLaps => lastLapIndex - 1 + deltaLaps);

  const desiredLeaderLapCount = lastLapIndex + addLaps;

  const leaderLaps = times
    .map(driver => driverLapCount(driver))
    .max();

  let updatedTimes = times;
  for (let i = 0; i < addLaps * drivers.count() * 2; i++) { // eslint-disable-line no-plusplus
    const nextDriver = findNextDriver(updatedTimes, leaderLaps - 1);
    if (nextDriver === undefined) {
      break;
    }
    const driverLaps = driverLapCount(updatedTimes.get(nextDriver));
    if (driverLaps >= desiredLeaderLapCount - 1) {
      break;
    }
    const driverNextLap = projectDriverLap(updatedTimes.get(nextDriver),
      drivers.get(nextDriver), pitStopLaps.get(nextDriver), pitModelParams, slowLapNumbers);
    let updatedDriverTimes = updatedTimes.get(nextDriver).set(driverLaps, driverNextLap);

    const projectedLaptime = updatedDriverTimes.get(driverLaps) -
                               updatedDriverTimes.get(driverLaps - 1);

    const firstUnpassableTime = updatedTimes
        .filter(driverTimes => driverTimes.get(driverLaps) + 0.5 >= driverNextLap)
        .map(driverTimes => driverTimes.get(driverLaps) - driverTimes.get(driverLaps - 1))
        .filter(laptime => projectedLaptime > laptime - pitModelParams.overtakePaceDelta)
        .map((ignored, driver) => updatedTimes.get(driver).get(driverLaps))
        .max();

    if (firstUnpassableTime !== undefined) {
      updatedDriverTimes = updatedDriverTimes.set(driverLaps, firstUnpassableTime + 0.5);
    }

    updatedTimes = updatedTimes.set(nextDriver, updatedDriverTimes);
  }

  return updatedTimes;
}

export default projectForwards;
