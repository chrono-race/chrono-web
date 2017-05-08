import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DriverHistory from './DriverHistoryComponent';

class DriverHistoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {drivers} = this.props;
    const selectedDriver = 'VAN';
    return (
      <DriverHistory driver={drivers[selectedDriver]}/>
    );
  }
}

DriverHistoryContainer.propTypes = {
  // drivers: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  console.log(`mapStateToProps with ${JSON.stringify(state)} and ${JSON.stringify(props)}`);
  return {
    drivers: state.drivers,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverHistoryContainer);
