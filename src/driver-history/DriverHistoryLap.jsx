import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import { toSectorTime, toLapTime } from '../session-data/timing-utils';
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

const DriverHistoryLap = ({ lap, driver, sessionBests }) => {
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
        width="3%"
        className={tyreClass(Immutable.fromJS({}), stint)}
        data-toggle="tooltip"
        title={tyrePrompt(Immutable.fromJS({}), stint)}
      >{tyreText(Immutable.fromJS({}), stint)}</td>

    </tr>
  );
};

DriverHistoryLap.propTypes = {
  lap: PropTypes.instanceOf(Immutable.Map).isRequired,
  driver: PropTypes.instanceOf(Immutable.Map).isRequired,
  sessionBests: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default DriverHistoryLap;
