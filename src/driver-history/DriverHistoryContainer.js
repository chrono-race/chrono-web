import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DriverHistory from './DriverHistoryComponent';

class DriverHistoryContainer extends Component {
  render() {
    const {drivers, selectedDriver} = this.props;
    return (
      <DriverHistory driver={drivers[selectedDriver]}/>
    );
  }
}

DriverHistoryContainer.propTypes = {
  // drivers: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    drivers: state.drivers,
    selectedDriver: state.selectedDriver,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverHistoryContainer);
