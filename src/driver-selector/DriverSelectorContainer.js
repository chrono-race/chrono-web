import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import DriverSelector from './DriverSelectorComponent';
import { selectDriver } from './driver-selector-actions';

class DriverSelectorContainer extends Component {
  render() {
    const { drivers, selectedDriver, selectDriver } = this.props;
    return (
      <DriverSelector drivers={drivers} selectedDriver={selectedDriver} onSelect={selectDriver}/>
    );
  }
}

DriverSelectorContainer.PropTypes = {
  drivers: PropTypes.array.isRequired,
  selectedDriver: PropTypes.string.isRequired,
  selectDriver: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
  return {
    drivers: Object.keys(state.drivers),
    selectedDriver: state.selectedDriver,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectDriver: (driver) => dispatch(selectDriver(driver)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DriverSelectorContainer);
