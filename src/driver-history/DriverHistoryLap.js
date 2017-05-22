import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { toSectorTime, toLapTime } from '../session-data/timing-utils';

function bestClass(type, lap, driverBests, sessionBests) {
  const time = lap.get(type);
  const driverBest = driverBests.get(type);
  const sessionBest = sessionBests.get(type);
  if (time === sessionBest) {
    return 'sessionBest';
  } else if (time === driverBest) {
    return 'personalBest';
  } else {
    return 'none';
  }
}

class DriverHistoryLap extends Component {
  render() {
    const { lap, driverBests, sessionBests } = this.props;
    const s1Class = bestClass('s1Time', lap, driverBests, sessionBests);
    return (
      <tr>
        <td>{lap.get('lapNumber')}</td>
        <td className={s1Class}>{toSectorTime(lap.get('s1Time'))}</td>
        <td>{toSectorTime(lap.get('s2Time'))}</td>
        <td>{toSectorTime(lap.get('s3Time'))}</td>
        <td>{toLapTime(lap.get('lapTime'))}</td>
      </tr>
    );
  }
}

DriverHistoryLap.PropTypes = {
  lap: PropTypes.object.isRequired,
  driverBests: PropTypes.object.isRequired,
  sessionBests: PropTypes.object.isRequired,
};

export default DriverHistoryLap;
