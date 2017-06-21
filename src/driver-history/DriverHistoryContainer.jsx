import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import DriverHistory from './DriverHistoryComponent';

const DriverHistoryContainer = ({ session, selectedDriver, selectedOpponent }) => {
  const drivers = session.get('drivers');
  const sessionBests = session.get('best');
  return (
    <DriverHistory
      driver={drivers.get(selectedDriver)}
      opponent={drivers.get(selectedOpponent)}
      sessionBests={sessionBests}
    />
  );
};

DriverHistoryContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
  selectedOpponent: PropTypes.string,
};

DriverHistoryContainer.defaultProps = {
  selectedDriver: '',
  selectedOpponent: '',
};

function mapStateToProps(state) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver.get('selectedDriver'),
    selectedOpponent: state.selectedDriver.get('selectedOpponent'),
  };
}

export default connect(mapStateToProps)(DriverHistoryContainer);
