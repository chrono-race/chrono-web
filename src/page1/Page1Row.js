import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { toSectorTime, toLapTime } from '../session-data/timing-utils'

class Page1Row extends Component {
  render() {
    const { lastLap } = this.props;
    return (
      <tr key={lastLap.get('driver')}>
        <td>{lastLap.get('position')}</td>
        <td>{lastLap.get('driver')}</td>
        <td>{toSectorTime(lastLap.get('gap'))}</td>
        <td>{toSectorTime(lastLap.get('interval'))}</td>
        <td>{toLapTime(lastLap.get('lapTime'))}</td>
        <td>{toSectorTime(lastLap.get('s1Time'))}</td>
        <td>{toSectorTime(lastLap.get('s2Time'))}</td>
        <td>{toSectorTime(lastLap.get('s3Time'))}</td>
      </tr>
    );
  }
}

Page1Row.PropTypes = {
  lastLap: PropTypes.object.isRequired,
};

export default Page1Row;
