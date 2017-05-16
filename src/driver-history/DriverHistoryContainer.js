import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import DriverHistory from './DriverHistoryComponent';

class DriverHistoryContainer extends Component {
  render() {
    const { session, selectedDriver } = this.props;
    const drivers = session.get('drivers');
    return (
      <DriverHistory driver={drivers.get(selectedDriver)}/>
    );
  }
}

DriverHistoryContainer.propTypes = {
  session: PropTypes.object.isRequired,
  selectedDriver: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverHistoryContainer);
