import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

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

DriverSelectorDriver.PropTypes = {
  driver: PropTypes.object.isRequired,
  onSelect: PropTypes.object.isRequired,
};

export default DriverSelectorDriver;
