import React, { Component } from 'react';
import DriverSelectorDriver from './DriverSelectorDriver';

class DriverSelectorComponent extends Component {
  render() {
    const driverRows = [];
    const { drivers, onSelect } = this.props;
    drivers.forEach(driver => driverRows.push(<DriverSelectorDriver key={driver} driver={driver} onSelect={onSelect}/>));
    return (
      <table>
        <thead>
          {driverRows}
        </thead>
      </table>
    );
  }
}

export default DriverSelectorComponent;
