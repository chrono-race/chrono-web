import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

function toSectorTime(t) {
  if (t === null || t === undefined) {
    return "";
  }
  return t.toFixed(3);
}

function toLapTime(t) {
  if (t === null || t === undefined) {
    return "";
  }
  const minutes = Math.floor(t / 60);
  let seconds = (t % 60);
  if (seconds < 10) {
    seconds = "0" + seconds.toFixed(3);
  } else {
    seconds = seconds.toFixed(3);
  }
  return minutes + ":" + seconds;
}

class DriverHistoryLap extends Component {
  render() {
    const { lap } = this.props;
    return (
      <tr>
        <td>{lap.get('lapNumber')}</td>
        <td>{toSectorTime(lap.get('s1Time'))}</td>
        <td>{toSectorTime(lap.get('s2Time'))}</td>
        <td>{toSectorTime(lap.get('s3Time'))}</td>
        <td>{toLapTime(lap.get('lapTime'))}</td>
      </tr>
    );
  }
}

DriverHistoryLap.PropTypes = {
  lap: PropTypes.object.isRequired,
};

export default DriverHistoryLap;
