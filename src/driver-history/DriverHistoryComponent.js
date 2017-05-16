import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import DriverHistoryLap from './DriverHistoryLap';

class DriverHistory extends Component {
  render() {
    const dhLaps = [];
    const { driver } = this.props;
    if (driver === undefined) {
      return (<div>No driver selected</div>);
    }
    driver.get('laps').toArray().forEach((lap, lapNumber) => {
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

DriverHistory.PropTypes = {
  driver: PropTypes.object.isRequired,
};

export default DriverHistory;