import React, { Component } from 'react';

class DriverSelectorComponent extends Component {
  onDriverClick(driver) {
    const { onSelect } = this.props;
    onSelect(driver);
  }

  render() {
    const driverRows = [];
    this.props.drivers.forEach(driver => driverRows.push((<tr><td><a style={{cursor:'pointer'}} onClick={() => this.onDriverClick(driver)}>{driver}</a></td></tr>)));
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
