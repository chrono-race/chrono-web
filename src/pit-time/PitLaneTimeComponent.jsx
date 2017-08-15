import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';

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
      console.log(`driver ${driver.get('tla')} stint starting on lap ${startLap} with in s3 ${inLapS3} (${averageS3}) and out s1 ${outLapS1} (${averageS1}) == ${timeLost} - isFreeAir ${isFreeAir}`);
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


const findPitLaneTimes = session =>
  session.get('drivers').valueSeq().flatMap(driver => findDriverPitLaneTimes(driver, session.get('freeAirLaps').get(driver.get('tla'))));

const PitLaneTime = ({ session }) => {
  console.log('finding pit times');
  const times = findPitLaneTimes(session);
  const rows = [];
  times.forEach((time) => {
    rows.push(
      (<tr key={time.lapNumber + time.driver}>
        <td>{time.lapNumber}</td>
        <td>{time.driver}</td>
        <td>{time.timeLost.toFixed(3)}</td>
      </tr>),
    );
  });
  return (
    <div>
      <table className="pit-lane-time-table">
        <tr>
          <th>lap #</th>
          <th>driver</th>
          <th>pit lane time</th>
        </tr>
        {rows}
      </table>
    </div>
  );
};

PitLaneTime.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default PitLaneTime;
