import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import DriverHistoryLap from './DriverHistoryLap';

const DriverHistory = ({ driver, sessionBests }) => {
  const dhLaps = [];
  if (driver === undefined) {
    return (<div>No driver selected</div>);
  }
  const driverBests = driver.get('best');
  driver.get('laps').toArray().forEach((lap) => {
    dhLaps.push(<DriverHistoryLap key={lap.get('lapNumber')} lap={lap} driverBests={driverBests} sessionBests={sessionBests} />);
  });

  return (
    <div>
      <table className="table table-striped timing-table">
        <thead>
          <tr>
            <th>#</th>
            <th>s1</th>
            <th>s2</th>
            <th>s3</th>
            <th>lap</th>
          </tr>
        </thead>
        <tbody>
          {dhLaps}
        </tbody>
      </table>
    </div>
  );
};

DriverHistory.propTypes = {
  driver: PropTypes.instanceOf(Immutable.Map),
  sessionBests: PropTypes.instanceOf(Immutable.Map).isRequired,
};

DriverHistory.defaultProps = {
  driver: undefined,
};

export default DriverHistory;
