import React, { Component } from 'react';
import { connect } from 'react-redux';
import DriverSelector from './DriverSelectorComponent';

class DriverSelectorContainer extends Component {
  render() {
    const { drivers, selectedDriver } = this.props;
    return (
      <DriverSelector drivers={drivers} selectedDriver={selectedDriver}/>
    );
  }
}

function mapStateToProps(state, props) {
  console.log(`mapStateToProps with ${JSON.stringify(state)} and ${JSON.stringify(props)}`);
  return {
    drivers: Object.keys(state.drivers),
    selectedDriver: state.selectedDriver,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DriverSelectorContainer);
