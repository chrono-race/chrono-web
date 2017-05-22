import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { toSectorTime, toLapTime } from '../session-data/timing-utils'

class Page1Row extends Component {
  render() {
    const { lastLap } = this.props;
    return (
      <tr key={lastLap.get('driver')}>
        <td width='6.6%'>{lastLap.get('position')}</td>
        <td width='6.6%'>{lastLap.get('driver')}</td>
        <td width='13.3%'>{toSectorTime(lastLap.get('gap'))}</td>
        <td width='13.3%'>{toSectorTime(lastLap.get('interval'))}</td>
        <td width='20.0%'>{toLapTime(lastLap.get('lapTime'))}</td>
        <td width='13.3%'>{toSectorTime(lastLap.get('s1Time'))}</td>
        <td width='13.3%'>{toSectorTime(lastLap.get('s2Time'))}</td>
        <td width='13.3%'>{toSectorTime(lastLap.get('s3Time'))}</td>
      </tr>
    );
  }
}

Page1Row.PropTypes = {
  lastLap: PropTypes.object.isRequired,
};

export default Page1Row;
