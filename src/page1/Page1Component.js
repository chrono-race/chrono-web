import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { toSectorTime, toLapTime } from '../session-data/timing-utils'

function getLastLap(driver) {
  const laps = driver.get('laps');
  if (laps.count() > 0) {
    return laps.get(laps.count()-1);
  }
  return undefined;
}

function createDriverRow(lastLap) {
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


class Page1 extends Component {
  render() {
    const { session } = this.props
    const driverRows = session.get('drivers')
      .valueSeq()
      .map(driver => getLastLap(driver))
      .sortBy(lap => lap.get('position'))
      .map(lap => createDriverRow(lap));
    return (
      <div>
        <table className='table timing-table'>
          <thead>
            <tr>
              <th>pos</th>
              <th>driver</th>
              <th>gap</th>
              <th>int</th>
              <th>lap</th>
              <th>s1</th>
              <th>s2</th>
              <th>s3</th>
            </tr>
          </thead>
          <tbody>
            {driverRows}
          </tbody>
        </table>
      </div>
    );
  }
}

Page1.PropTypes = {
  session: PropTypes.object.isRequired,
};

export default Page1;