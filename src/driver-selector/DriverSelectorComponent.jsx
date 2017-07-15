import React from 'react';
import { PropTypes } from 'prop-types';
import DriverSelectorDriver from './DriverSelectorDriver';
import Immutable from 'immutable';

const DriverSelectorComponent = ({ drivers, onSelect, selectedDriver, showVs }) => {
  const driverRows = [];
  if (showVs) {
    driverRows.push((<tr key="vs"><th style={{ textAlign: 'center' }}>vs</th></tr>));
  }

  const localDrivers = drivers.keySeq().toArray();

  localDrivers.sort((a, b) => {
    const driverA = drivers.get(a);
    const driverB = drivers.get(b);

    const driverATeamOrder = driverA.get('teamOrder');
    const driverBTeamOrder = driverB.get('teamOrder');

    return driverATeamOrder === driverBTeamOrder ? driverA.get('number') - driverB.get('number') : driverATeamOrder - driverBTeamOrder;
  });

  localDrivers.forEach((driver, index) => driverRows.push((
    <DriverSelectorDriver
      key={driver} index={index} driver={driver} onSelect={onSelect} selectedDriver={selectedDriver}
    />)));
  return (
    <table>
      <thead>
        {driverRows}
      </thead>
    </table>
  );
};

DriverSelectorComponent.propTypes = {
  drivers: PropTypes.instanceOf(Immutable.Map).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedDriver: PropTypes.string.isRequired,
  showVs: PropTypes.bool,
};

DriverSelectorComponent.defaultProps = {
  showVs: false,
};

export default DriverSelectorComponent;
