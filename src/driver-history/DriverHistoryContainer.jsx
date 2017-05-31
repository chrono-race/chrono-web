import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import DriverHistory from './DriverHistoryComponent';

const DriverHistoryContainer = ({ session, selectedDriver }) => {
  const drivers = session.get('drivers');
  const sessionBests = session.get('best');
  return (
    <DriverHistory driver={drivers.get(selectedDriver)} sessionBests={sessionBests} />
  );
};

DriverHistoryContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver,
  };
}

export default connect(mapStateToProps)(DriverHistoryContainer);
