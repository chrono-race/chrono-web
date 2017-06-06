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
    <div className="flex-container">
      <div className="timing-table-header">
        <table className="table table-striped timing-table driver-history">
          <thead>
            <tr>
              <th className="lapNumber">#</th>
              <th className="s1Time">s1</th>
              <th className="s2Time">s2</th>
              <th className="s3Time">s3</th>
              <th className="lapTime">lap</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="scrolling">
        <table className="table table-striped timing-table driver-history">
          <tbody>
            {dhLaps}
          </tbody>
        </table>
      </div>
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
