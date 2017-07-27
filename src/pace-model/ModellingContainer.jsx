import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import FuelModelComponent from './FuelModelComponent';
import { selectModellingTab } from './model-actions';

const fuelTab = (session, selectedDriver, paceModel) => (
  <div className="model-content">
    <div className="model-content-table">
      <div className="model-plot">
        <FuelModelComponent session={session} selectedDriver={selectedDriver} />
      </div>
      <div className="model-info">
        <div className="model-param">Fuel Effect</div>
        <div className="model-value">{paceModel.fuelEffect.toFixed(3)} sec/lap</div>
      </div>
    </div>
  </div>
);

const tabContent = (selectedTab, session, selectedDriver, paceModel) => {
  if (selectedTab === 'fuel') {
    return fuelTab(session, selectedDriver, paceModel);
  }
  return (<div />);
};

const tab = (selectedTab, tabName, tabTitle, onClick) => (
  <li className={selectedTab === tabName ? 'active' : ''}>
    <a onClick={onClick} tabIndex="-1">{tabTitle}</a>
  </li>
);

const ModellingContainer = ({ session, selectedDriver, showTyreDeg, selectedTab,
  showFuelEffect }) => {
  const paceModel = session.get('paceModel');
  if (paceModel.fuelEffect === undefined) {
    return (
      <div>Not enough data to model fuel effect</div>
    );
  }

  return (
    <div className="model-table">
      <div className="model-tabs">
        <ul className="nav nav-tabs">
          {tab(selectedTab, 'fuel', 'Fuel Effect', showFuelEffect)}
          {tab(selectedTab, 'tyres', 'Tyre Deg', showTyreDeg)}
        </ul>
      </div>

      {tabContent(selectedTab, session, selectedDriver, paceModel)}
    </div>
  );
};

ModellingContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
  showTyreDeg: PropTypes.func.isRequired,
  showFuelEffect: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired,
};

ModellingContainer.defaultProps = {
  selectedDriver: '',
};

function mapStateToProps(state) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver.get('selectedDriver'),
    selectedTab: state.modelling.get('selectedTab'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showFuelEffect: () => dispatch(selectModellingTab('fuel')),
    showTyreDeg: () => dispatch(selectModellingTab('tyres')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModellingContainer);
