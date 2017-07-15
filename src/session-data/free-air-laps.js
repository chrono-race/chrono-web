import { fromJS } from 'immutable';

function removeSlowLaps(laps) {
  const min = Math.min(...laps.map(lap => lap.lapTime));
  return laps.filter(lap => lap.lapTime < min * 1.05);
}

function isFreeAirForDriver(time, driver) {
  return driver.get('cumulativeTime').find(t => Math.abs(time - t) < 2) === undefined;
}

function isFreeAir(time, allDrivers, currDriver) {
  return allDrivers.find(driver => driver.get('tla') !== currDriver &&
                                  !isFreeAirForDriver(time, driver)) === undefined;
}

function mapStartLap(lap) {
  if (lap === 0) {
    return 1;
  }
  return lap;
}

function findDriverFreeAirLaps(driver, allDrivers) {
  const cTime = driver.get('cumulativeTime');
  const maxLapIndex = cTime.findLastIndex(t => t !== undefined);
  let lastWasFreeAir = false;
  let lastCTime = NaN;
  const stints = driver.get('stints');
  const freeAirLaps = [];
  for (let lapIndex = 1; lapIndex < maxLapIndex; lapIndex++) { // eslint-disable-line
    const thisCTime = cTime.get(lapIndex);
    const thisFreeAir = isFreeAir(thisCTime, allDrivers, driver.get('tla'));

    const isInLap = stints.filter(stint => parseInt(stint.get('startLap'), 10) === (lapIndex + 2)).count() > 0;
    const isOutLap = stints.filter(stint => stint.get('startLap') === lapIndex + 1).count() > 0;
    const currStint = stints.findLast(stint => stint.get('startLap') <= lapIndex + 1);

    if (!isInLap && !isOutLap && lastWasFreeAir && thisFreeAir) {
      const lapTime = thisCTime - lastCTime;
      const tyreAge = (lapIndex + 1 + currStint.get('tyreAge')) - mapStartLap(currStint.get('startLap'));

      freeAirLaps.push({
        raceLapIndex: lapIndex,
        stintLapIndex: tyreAge - 1,
        tyre: currStint.get('tyre'),
        lapTime,
      });
    }
    lastWasFreeAir = thisFreeAir;
    lastCTime = thisCTime;
  }
  return freeAirLaps;
}

// returns driver indexed structure, each driver maps to an array of:
//   raceLapIndex
//   stintLapIndex
//   tyre
//   lapTime
function findFreeAirLaps(drivers) {
  return fromJS(drivers.map(driver => removeSlowLaps(findDriverFreeAirLaps(driver, drivers))));
}

export default findFreeAirLaps;
