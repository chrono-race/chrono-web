import React, { Component } from 'react';

class DriverSelectorDriver extends Component {
  onDriverClick(driver) {
    const { onSelect } = this.props;
    onSelect(driver);
  }

  render() {
    const { driver } = this.props;
    return (
      <tr>
        <td>
         <a style={{cursor:'pointer'}} onClick={() => this.onDriverClick(driver)}>{driver}</a>
        </td>
      </tr>
    );
  }
}

export default DriverSelectorDriver;
