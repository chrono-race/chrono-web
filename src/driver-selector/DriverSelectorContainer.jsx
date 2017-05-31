import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import DriverSelector from './DriverSelectorComponent';
import { selectDriver } from './driver-selector-actions';

const DriverSelectorContainer = ({ drivers, selectedDriver, onSelect }) => (
  <DriverSelector drivers={drivers} selectedDriver={selectedDriver} onSelect={onSelect} />
);

DriverSelectorContainer.propTypes = {
  drivers: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedDriver: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    drivers: state.session.get('drivers').keySeq().toArray(),
    selectedDriver: state.selectedDriver,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelect: (driver) => {
      dispatch(selectDriver(driver));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DriverSelectorContainer);
