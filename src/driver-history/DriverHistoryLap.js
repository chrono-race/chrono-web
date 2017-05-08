import React, { Component } from 'react';

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

export default DriverHistoryLap;
