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

const Page1Row = ({ lastLap, driverBests, sessionBests }) => (
  <tr key={lastLap.get('driver')}>
    <td width="6.6%" className="position">{lastLap.get('position')}</td>
    <td width="6.6%" className="driver">{lastLap.get('driver')}</td>
    <td width="13.3%" className="gap">{toGapOrLap(lastLap)}</td>
    <td width="13.3%" className="interval">{toIntervalOrLapNumber(lastLap)}</td>
    <td width="20.0%" className={bestClass('lapTime', lastLap, driverBests, sessionBests)}>{toLapTime(lastLap.get('lapTime'))}</td>
    <td width="13.3%" className={bestClass('s1Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s1Time'))}</td>
    <td width="13.3%" className={bestClass('s2Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s2Time'))}</td>
    <td width="13.3%" className={bestClass('s3Time', lastLap, driverBests, sessionBests)}>{toSectorTime(lastLap.get('s3Time'))}</td>
  </tr>
);

Page1Row.propTypes = {
  lastLap: PropTypes.instanceOf(Immutable.Map).isRequired,
  driverBests: PropTypes.instanceOf(Immutable.Map).isRequired,
  sessionBests: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default Page1Row;
