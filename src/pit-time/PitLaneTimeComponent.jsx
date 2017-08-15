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

const heading = (title, sortBy, sortField, currentSortField) => {
  const sortSymbol = sortField === currentSortField
    ? (<div className="sort-symbol">&darr;</div>)
    : (<div className="sort-symbol">&nbsp;</div>);
  return (
    <a onClick={() => sortBy(sortField)} tabIndex="-1">{title} {sortSymbol}</a>
  );
};

const PitLaneTime = ({ session, sortBy, sortColumn }) => {
  const times = findPitLaneTimes(session).sortBy(x => x[sortColumn]);
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
        <thead>
          <tr>
            <th>{heading('lap #', sortBy, 'lapNumber', sortColumn)}</th>
            <th>{heading('driver', sortBy, 'driver', sortColumn)}</th>
            <th>{heading('pit lane time', sortBy, 'timeLost', sortColumn)}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

PitLaneTime.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  sortBy: PropTypes.func.isRequired,
  sortColumn: PropTypes.string.isRequired,
};

export default PitLaneTime;
