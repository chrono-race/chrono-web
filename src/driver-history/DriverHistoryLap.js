import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class DriverHistoryLap extends Component {
  render() {
    const { lap } = this.props;
    return (
      <tr>
        <td>{lap.get('lapNumber')}</td>
        <td>{lap.get('s1Time')}</td>
        <td>{lap.get('s2Time')}</td>
        <td>{lap.get('s3Time')}</td>
        <td>{lap.get('lapTime')}</td>
      </tr>
    );
  }
}

DriverHistoryLap.PropTypes = {
  lap: PropTypes.object.isRequired,
};

export default DriverHistoryLap;
