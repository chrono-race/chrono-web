import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import DriverSelector from './DriverSelectorComponent';
import { selectDriver, selectOpponent } from './driver-selector-actions';

const DriverSelectorContainer =
  ({ drivers, selectedDriver, selectedOpponent, onSelect, onSelectOpponent, choice }) => {
    if (choice === 'driver') {
      return (
        <DriverSelector drivers={drivers} selectedDriver={selectedDriver} onSelect={onSelect} />
      );
    }
    if (selectedDriver === '') {
      return (<div />);
    }
    return (
      <DriverSelector drivers={drivers} selectedDriver={selectedOpponent} onSelect={onSelectOpponent} />
    );
  };

DriverSelectorContainer.propTypes = {
  drivers: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedDriver: PropTypes.string.isRequired,
  selectedOpponent: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSelectOpponent: PropTypes.func.isRequired,
  choice: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    drivers: state.session.get('drivers').keySeq().toArray(),
    selectedDriver: state.selectedDriver.get('selectedDriver'),
    selectedOpponent: state.selectedDriver.get('selectedOpponent'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelect: (driver) => {
      dispatch(selectDriver(driver));
    },
    onSelectOpponent: (driver) => {
      dispatch(selectOpponent(driver));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DriverSelectorContainer);
