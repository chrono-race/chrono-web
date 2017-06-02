import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import { toSectorTime, toLapTime } from '../session-data/timing-utils';

function bestClass(type, lap, driverBests, sessionBests) {
  const time = lap.get(type);
  const driverBest = driverBests.get(type);
  const sessionBest = sessionBests.get(type);
  if (time === sessionBest) {
    return 'sessionBest';
  } else if (time === driverBest) {
    return 'personalBest';
  }
  return 'none';
}

const Page1Row = ({ lastLap, driverBests, sessionBests }) => (
  <tr key={lastLap.get('driver')}>
    <td width="6.6%" className="position">{lastLap.get('position')}</td>
    <td width="6.6%">{lastLap.get('driver')}</td>
    <td width="13.3%">{toSectorTime(lastLap.get('gap'))}</td>
    <td width="13.3%">{toSectorTime(lastLap.get('interval'))}</td>
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
