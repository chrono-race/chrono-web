import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { toSectorTime, toLapTime } from '../session-data/timing-utils';

function getPersonalOrSessionBest(time, personalBest, sessionBest) {
  if (time === sessionBest) {
    return 'sessionBest';
  } else if (time === personalBest) {
    return 'personalBest';
  } else {
    return 'none';
  }
}

class DriverHistoryLap extends Component {
  render() {
    const { lap, driverBests, sessionBests } = this.props;
    const s1Class = getPersonalOrSessionBest(lap.get('s1Time'), driverBests.get('s1Time'), sessionBests.get('s1Time'));
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
