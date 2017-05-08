import React, { Component } from 'react';
import DriverHistoryLap from './DriverHistoryLap';

class DriverHistory extends Component {
  render() {
    const dhLaps = [];
    this.props.driver.laps.forEach((lap, lapNumber) => {
      dhLaps.push(<DriverHistoryLap key={lapNumber} lap={lap}/>);
    });

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Lap</th>
              <th>S1 Time</th>
              <th>S2 Time</th>
              <th>S3 Time</th>
              <th>Lap Time</th>
            </tr>
          </thead>
          <tbody> 
            {dhLaps}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DriverHistory;