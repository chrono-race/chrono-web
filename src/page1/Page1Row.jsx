import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import { toSectorTime, toLapTime, toGapTime } from '../session-data/timing-utils';
import { tyreClass, tyreText, tyrePrompt } from '../session-data/tyres';

function bestClass(type, lap, driverBests, sessionBests) {
  const time = lap.get(type);
  const driverBest = driverBests.get(type);
  const sessionBest = sessionBests.get(type);
  if (time === sessionBest) {
    return `${type} sessionBest`;
  } else if (time === driverBest) {
    return `${type} personalBest`;
  }
  return `${type} none`;
}

function toGapOrLap(lastLap) {
  if (lastLap.get('position') === 1) {
    return 'LAP';
  }
  return toGapTime(lastLap.get('gap'));
}

function toIntervalOrLapNumber(lastLap, totalLaps) {
  if (lastLap.get('position') === 1) {
    let lapNumberToDisplay = lastLap.get('lapNumber');

    if (lastLap.get('s3Time') && lapNumberToDisplay !== totalLaps) {
      /* we have S3 time from last lap and lapNumber is not same as total laps
         so we show the next lap is in progress */
      lapNumberToDisplay += 1;
    }

    return `${lapNumberToDisplay}/${totalLaps}`;
  }
  return toSectorTime(lastLap.get('interval'));
}

function inPitOr(driver, alternative) {
  if (driver.get('currentStatus') === 'pit') {
    return 'pit';
  }
  return alternative;
}

const Page1Row = ({ lastLap, sessionBests, driver, totalLaps }) => {
  const driverBests = driver !== undefined ? driver.get('best') : undefined;
  const lastStint = driver.get('stints').count() === 0 ? undefined : driver.get('stints').get(driver.get('stints').count() - 1);
  return (
    <tr key={lastLap.get('driver')}>
      <td width="6.6%" className="position">{lastLap.get('position')}</td>
      <td width="6.6%" className="driver">{lastLap.get('driver')}</td>
      <td width="13.3%" className="gap">{toGapOrLap(lastLap)}</td>
      <td width="13.3%" className="interval">{toIntervalOrLapNumber(lastLap, totalLaps)}</td>
      <td width="16.6%" className={bestClass('lapTime', lastLap, driverBests, sessionBests)}>{toLapTime(lastLap.get('lapTime'))}</td>
      <td width="13.3%" className={bestClass('s1Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s1Time'))}</td>
      <td width="13.3%" className={bestClass('s2Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s2Time'))}</td>
      <td width="13.3%" className={bestClass('s3Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s3Time'))}</td>
      <td
        width="3%"
        className={inPitOr(driver, tyreClass(lastStint))}
        data-toggle="tooltip"
        title={inPitOr(driver, tyrePrompt(lastStint))}
      >{inPitOr(driver, tyreText(lastStint))}</td>
    </tr>
  );
};

Page1Row.propTypes = {
  lastLap: PropTypes.instanceOf(Immutable.Map).isRequired,
  sessionBests: PropTypes.instanceOf(Immutable.Map).isRequired,
  driver: PropTypes.instanceOf(Immutable.Map).isRequired,
  totalLaps: PropTypes.number.isRequired,
};

export default Page1Row;
