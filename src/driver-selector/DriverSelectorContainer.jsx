import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
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
        drivers={drivers.filter(d => d !== selectedDriver)}
        selectedDriver={selectedOpponent}
        onSelect={onSelectOpponent}
        showVs
      />
    );
  };

DriverSelectorContainer.propTypes = {
  drivers: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  const driversMap = state.session.get('drivers');
  const localDrivers = driversMap.keySeq().toArray();

  localDrivers.sort((a, b) => {
    const driverA = driversMap.get(a);
    const driverB = driversMap.get(b);

    const driverATeamOrder = driverA.get('teamOrder');
    const driverBTeamOrder = driverB.get('teamOrder');

    return driverATeamOrder === driverBTeamOrder ? driverA.get('number') - driverB.get('number') : driverATeamOrder - driverBTeamOrder;
  });

  return {
    drivers: localDrivers,
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
