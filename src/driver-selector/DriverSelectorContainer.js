import React, { Component } from 'react';
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
