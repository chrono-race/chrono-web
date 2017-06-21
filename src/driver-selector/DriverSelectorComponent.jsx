import React from 'react';
import { PropTypes } from 'prop-types';
import DriverSelectorDriver from './DriverSelectorDriver';

const DriverSelectorComponent = ({ drivers, onSelect, selectedDriver, showVs }) => {
  const driverRows = [];
  if (showVs) {
    driverRows.push((<th style={{ textAlign: 'center' }}>vs</th>));
  }
  drivers.forEach((driver, index) => driverRows.push((
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
  drivers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedDriver: PropTypes.string.isRequired,
  showVs: PropTypes.bool.isRequired,
};

export default DriverSelectorComponent;
