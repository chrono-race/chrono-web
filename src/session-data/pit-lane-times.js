
const get3LapAverage = (laps, startLap, field) => {
  let sum = 0;
  for (let lap = startLap; lap < startLap + 3; lap++) { // eslint-disable-line
    sum += laps.get(lap).get(field);
  }
  return sum / 3.0;
};

const findStintPitLaneTime = (driver, stint, freeAirLaps) => {
  const laps = driver.get('laps');
  const startLap = parseInt(stint.get('startLap'), 10);
  if (startLap > 4 && startLap < laps.count() - 2) {
    const isFreeAir = freeAirLaps.find(freeAirLap =>
                        freeAirLap.raceLapIndex >= startLap - 5 &&
                        freeAirLap.raceLapIndex <= startLap + 2) !== undefined;
    if (isFreeAir) {
      const inLapS3 = laps.get(startLap - 2).get('s3Time');
      const outLapS1 = laps.get(startLap - 1).get('s1Time');
      const averageS3 = get3LapAverage(laps, startLap - 5, 's3Time');
      const averageS1 = get3LapAverage(laps, startLap, 's1Time');
      const timeLost = (inLapS3 - averageS3) + (outLapS1 - averageS1);
      return {
        lapNumber: startLap - 1,
        driver: driver.get('tla'),
        timeLost,
      };
    }
  }
  return undefined;
};

const findDriverPitLaneTimes = (driver, freeAirLaps) =>
  driver.get('stints')
    .filter(stint => stint.get('startLap') > 0)
    .map(stint => findStintPitLaneTime(driver, stint, freeAirLaps))
    .filter(t => t !== undefined);


const findPitLaneTimes = (drivers, freeAirLaps) =>
  drivers.valueSeq().flatMap(driver => findDriverPitLaneTimes(driver, freeAirLaps.get(driver.get('tla'))));

export default findPitLaneTimes;
