import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import { toSectorTime, toLapTime } from '../session-data/timing-utils';
import { tyreClass, tyreText, tyrePrompt } from '../session-data/tyres';
import bestClass from './bestClass';
import getDelta from './getDelta';

function stintForLap(lapNumber, driver) {
  return driver.get('stints').findLast(stint => stint.get('startLap') <= lapNumber);
}

function pitText(lapNumber, stints) {
  const isInLap = stints.filter(stint => parseInt(stint.get('startLap'), 10) === (lapNumber + 1)).count() > 0;
  const isOutLap = stints.filter(stint => stint.get('startLap') === lapNumber).count() > 0;

  if (isInLap && isOutLap) {
    return 'OutIn';
  } else if (isInLap) {
    return 'In';
  } else if (isOutLap) {
    return 'Out';
  }
  return '';
}

const DriverHistoryLap = ({ lap, driver, opponent, sessionBests }) => {
  const driverBests = driver.get('best');
  const stint = stintForLap(lap.get('lapNumber'), driver) || Immutable.fromJS({});
  return (
    <tr>
      <td className="lapNumber">{lap.get('lapNumber')}</td>
      <td className={bestClass('s1Time', lap, driverBests, sessionBests)}>{toSectorTime(lap.get('s1Time'))}</td>
      <td className={bestClass('s2Time', lap, driverBests, sessionBests)}>{toSectorTime(lap.get('s2Time'))}</td>
      <td className={bestClass('s3Time', lap, driverBests, sessionBests)}>{toSectorTime(lap.get('s3Time'))}</td>
      <td className={bestClass('lapTime', lap, driverBests, sessionBests)}>{toLapTime(lap.get('lapTime'))}</td>
      <td className="pit">{pitText(lap.get('lapNumber'), driver.get('stints'))}</td>
      <td
        className={`tyre ${tyreClass(stint)}`}
        data-toggle="tooltip"
        title={tyrePrompt(stint)}
      >{tyreText(stint)}</td>
      <td className="gap">{getDelta(driver, opponent, lap.get('lapNumber'))}</td>
    </tr>
  );
};

DriverHistoryLap.propTypes = {
  lap: PropTypes.instanceOf(Immutable.Map).isRequired,
  driver: PropTypes.instanceOf(Immutable.Map),
  opponent: PropTypes.instanceOf(Immutable.Map),
  sessionBests: PropTypes.instanceOf(Immutable.Map).isRequired,
};

DriverHistoryLap.defaultProps = {
  driver: undefined,
  opponent: undefined,
};

export default DriverHistoryLap;
