import React, { Component } from 'react';

class DriverSelectorComponent extends Component {
  render() {
    const driverRows = [];
    this.props.drivers.forEach(driver => driverRows.push((<tr><td>{driver}</td></tr>)));
    return (
      <table>
        {driverRows}
      </table>
    );
  }
}

export default DriverSelectorComponent;
