import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import DriverSelectorDriver from './DriverSelectorDriver';

class DriverSelectorComponent extends Component {
  render() {
    const driverRows = [];
    const { drivers, onSelect } = this.props;
    drivers.forEach(driver => driverRows.push(<DriverSelectorDriver key={driver} driver={driver} onSelect={onSelect}/>));
    return (
      <table>
        <thead>
          <tr>
            <th>Drivers</th>
          </tr>
          {driverRows}
        </thead>
      </table>
    );
  }
}

DriverSelectorComponent.PropTypes = {
  drivers: PropTypes.array.isRequired,
  onSelect: PropTypes.object.isRequired,
};

export default DriverSelectorComponent;
