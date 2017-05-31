import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class DriverSelectorDriver extends Component {
  onDriverClick(driver) {
    const { onSelect } = this.props;
    onSelect(driver);
  }

  render() {
    const { driver, selectedDriver, index } = this.props;
    let className = 'btn btn-primary btn-xs btn-block';
    if (selectedDriver === driver) {
      className += ' active';
    }
    return (
      <tr>
        <td>
          <a
            className={className} tabIndex={index * -1}
            style={{ cursor: 'pointer', marginBottom: '2px' }}
            onClick={() => this.onDriverClick(driver)}
          >{driver}</a>
        </td>
      </tr>
    );
  }
}

DriverSelectorDriver.propTypes = {
  driver: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedDriver: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default DriverSelectorDriver;
