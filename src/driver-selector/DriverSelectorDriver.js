import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class DriverSelectorDriver extends Component {
  onDriverClick(driver) {
    const { onSelect } = this.props;
    onSelect(driver);
  }

  render() {
    const { driver, selectedDriver } = this.props;
    let className = 'btn btn-primary btn-xs btn-block';
    if (selectedDriver === driver) {
      className += ' active';
    }
    return (
      <tr>
        <td>
         <a className={className}
            style={{cursor:'pointer', marginBottom: '2px'}}
            onClick={() => this.onDriverClick(driver)}>{driver}</a>
        </td>
      </tr>
    );
  }
}

DriverSelectorDriver.PropTypes = {
  driver: PropTypes.object.isRequired,
  onSelect: PropTypes.object.isRequired,
  selectedDriver: PropTypes.object.isRequired,
};

export default DriverSelectorDriver;
