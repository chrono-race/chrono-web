import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import FuelModelComponent from './FuelModelComponent';

const FuelModelContainer = ({ session, selectedDriver }) => {
  const paceModel = session.get('paceModel');
  if (paceModel.fuelEffect === undefined) {
    return (
      <div>Not enough data to model fuel effect</div>
    );
  }
  return (
    <FuelModelComponent session={session} selectedDriver={selectedDriver} />
  );
};

FuelModelContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
};

FuelModelContainer.defaultProps = {
  selectedDriver: '',
};

function mapStateToProps(state) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver.get('selectedDriver'),
  };
}

export default connect(mapStateToProps)(FuelModelContainer);
