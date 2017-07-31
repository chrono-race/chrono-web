import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import Page1Row from './Page1Row';

function getLastLap(driver) {
  const laps = driver.get('laps');
  if (laps.count() > 0) {
    const lastLap = laps.get(laps.count() - 1);
    if (laps.count() > 1 && lastLap.get('lapTime') === null) {
      return lastLap.set('lapTime', laps.get(laps.count() - 2).get('lapTime'));
    }
    return lastLap;
  }
  return undefined;
}

const Page1 = ({ session }) => {
  const sessionBests = session.get('best');
  const driverRows = session.get('drivers')
    .valueSeq()
    .map(driver => getLastLap(driver))
    .filter(lap => lap !== undefined)
    .sortBy(lap => lap.get('position'))
    .map(lap => <Page1Row
      key={lap.get('driver')}
      lastLap={lap}
      driver={session.get('drivers').get(lap.get('driver'))}
      sessionBests={sessionBests}
      totalLaps={session.get('totalLaps')}
    />);
  return (
    <div className="auto-scroll-container">
      <table className="table table-striped timing-table">
        <thead>
          <tr>
            <th>pos</th>
            <th />
            <th>driver</th>
            <th>gap</th>
            <th>int</th>
            <th>lap</th>
            <th>s1</th>
            <th>s2</th>
            <th>s3</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {driverRows}
        </tbody>
      </table>
    </div>
  );
};

Page1.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default Page1;
