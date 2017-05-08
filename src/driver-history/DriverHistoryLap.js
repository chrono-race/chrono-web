import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class DriverHistoryLap extends Component {
  render() {
    const { lap } = this.props;
    return (
      <tr>
        <td>{lap.lapNumber}</td>
        <td>{lap.s1Time}</td>
        <td>{lap.s2Time}</td>
        <td>{lap.s3Time}</td>
        <td>{lap.lapTime}</td>
      </tr>
    );
  }
}

DriverHistoryLap.PropTypes = {
  lap: PropTypes.object.isRequired,
};

export default DriverHistoryLap;
