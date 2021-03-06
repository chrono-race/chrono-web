import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import DriverSelector from './DriverSelectorComponent';
import { selectDriver, selectOpponent } from './driver-selector-actions';

const DriverSelectorContainer =
  ({ drivers, selectedDriver, selectedOpponent, onSelect, onSelectOpponent, choice }) => {
    if (choice === 'driver') {
      return (
        <DriverSelector
          drivers={drivers}
          selectedDriver={selectedDriver}
          onSelect={onSelect}
        />
      );
    }
    if (selectedDriver === '') {
      return (<div />);
    }
    return (
      <DriverSelector
        drivers={drivers.filter(d => d.get('tla') !== selectedDriver)}
        selectedDriver={selectedOpponent}
        onSelect={onSelectOpponent}
        showVs
      />
    );
  };

DriverSelectorContainer.propTypes = {
  drivers: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
  selectedOpponent: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onSelectOpponent: PropTypes.func.isRequired,
  choice: PropTypes.string.isRequired,
};

DriverSelectorContainer.defaultProps = {
  selectedDriver: '',
  selectedOpponent: '',
};

function mapStateToProps(state) {
  return {
    drivers: state.session.get('drivers'),
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
