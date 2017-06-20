import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import { toSectorTime, toLapTime } from '../session-data/timing-utils';

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
  return toSectorTime(lastLap.get('gap'));
}

function toIntervalOrLapNumber(lastLap) {
  if (lastLap.get('position') === 1) {
    if (lastLap.get('s3Time') == null) {
      return lastLap.get('lapNumber');
    }
    return lastLap.get('lapNumber') + 1;
  }
  return toSectorTime(lastLap.get('interval'));
}

function tyreClass(driver, lastStint) {
  if (driver.get('currentStatus') === 'pit') {
    return 'pit';
  }
  const tyreAge = lastStint.get('tyreAge') === 0 ? 'new' : 'used';
  const tyreType = lastStint.get('tyre');
  return `${tyreAge}-${tyreType}`;
}

function tyreText(driver, lastStint) {
  if (driver.get('currentStatus') === 'pit') {
    return 'pit';
  }
  const code = lastStint.get('tyre');
  switch (code) {
    case 'E': return 'US';
    case 'V': return 'SS';
    case 'S': return 'S';
    case 'M': return 'M';
    case 'H': return 'H';
    default: return code;
  }
}

function tyrePrompt(driver, lastStint) {
  if (driver.get('currentStatus') === 'pit') {
    return 'pit';
  }
  const tyreAge = lastStint.get('tyreAge') === 0 ? 'new' : 'used';
  const code = lastStint.get('tyre');
  switch (code) {
    case 'E': return `${tyreAge} ultra soft`;
    case 'V': return `${tyreAge} super soft`;
    case 'S': return `${tyreAge} soft`;
    case 'M': return `${tyreAge} medium`;
    case 'H': return `${tyreAge} hard`;
    default: return '';
  }
}

const Page1Row = ({ lastLap, sessionBests, driver }) => {
  const driverBests = driver !== undefined ? driver.get('best') : undefined;
  const lastStint = driver.get('stints').count() === 0 ? undefined : driver.get('stints').get(driver.get('stints').count() - 1);
  return (
    <tr key={lastLap.get('driver')}>
      <td width="6.6%" className="position">{lastLap.get('position')}</td>
      <td width="6.6%" className="driver">{lastLap.get('driver')}</td>
      <td width="13.3%" className="gap">{toGapOrLap(lastLap)}</td>
      <td width="13.3%" className="interval">{toIntervalOrLapNumber(lastLap)}</td>
      <td width="16.6%" className={bestClass('lapTime', lastLap, driverBests, sessionBests)}>{toLapTime(lastLap.get('lapTime'))}</td>
      <td width="13.3%" className={bestClass('s1Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s1Time'))}</td>
      <td width="13.3%" className={bestClass('s2Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s2Time'))}</td>
      <td width="13.3%" className={bestClass('s3Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s3Time'))}</td>
      <td width="3%" className={tyreClass(driver, lastStint)} data-toggle="tooltip" title={tyrePrompt(driver, lastStint)}>{tyreText(driver, lastStint)}</td>
    </tr>
  );
};

Page1Row.propTypes = {
  lastLap: PropTypes.instanceOf(Immutable.Map).isRequired,
  sessionBests: PropTypes.instanceOf(Immutable.Map).isRequired,
  driver: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default Page1Row;
