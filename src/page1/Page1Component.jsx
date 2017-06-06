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
    .sortBy(lap => lap.get('position'))
    .map(lap => <Page1Row key={lap.get('driver')} lastLap={lap} driverBests={session.get('drivers').get(lap.get('driver')).get('best')} sessionBests={sessionBests} />);
  return (
    <div className="auto-scroll-container">
      <table className="table timing-table">
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
};

Page1.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default Page1;
