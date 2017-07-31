import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { tyreCode } from '../session-data/tyres';
import FuelModelComponent from './FuelModelComponent';
import TyreModelComponent from './TyreModelComponent';
import { selectModellingTab, selectModellingTyre } from './model-actions';

const toFixed = (num) => {
  if (num < 0) {
    return num.toFixed(3);
  }
  return `+${num.toFixed(3)}`;
};

const fuelTab = (session, selectedDriver, paceModel) => (
  <div className="model-content">
    <div className="model-content-table">
      <div className="model-plot">
        <FuelModelComponent session={session} selectedDriver={selectedDriver} />
      </div>
      <div className="model-info">
        <div className="model-param">Fuel Effect</div>
        <div className="model-value">{toFixed(paceModel.fuelEffect)} sec/lap</div>
      </div>
    </div>
  </div>
);

const deltaIfAny = (delta, baseTyre) => {
  if (delta !== undefined) {
    return (<div className="model-sub-value">{toFixed(delta)} sec vs {tyreCode(baseTyre)}</div>);
  }
  return (<div />);
};
const tyreChoice = (tyre, deg, delta, baseTyre, selectedTyre, onSelect) => (
  <div key={tyre} className="model-block">
    <div className={`model-param used-${tyre}`}>
      <input
        type="radio"
        checked={selectedTyre === tyre ? 'selected' : ''}
        onClick={onSelect}
      />
      &nbsp;
      {tyreCode(tyre)}
    </div>
    <div className="model-value">{toFixed(deg)} sec/lap</div>
    {deltaIfAny(delta, baseTyre)}
  </div>
);

const getDelta = (tyre, deltaMap, baseTyre) => {
  if (tyre === baseTyre) {
    return undefined;
  }
  return deltaMap[tyre];
};

const tyreChooser = (session, paceModel, selectedTyre, selectTyre) => (
  <div>
    {Object.keys(paceModel.tyreModel.deg)
           .map(tyre => tyreChoice(
              tyre,
              paceModel.tyreModel.deg[tyre],
              getDelta(tyre, paceModel.tyreModel.delta, paceModel.tyreModel.baseTyre),
              paceModel.tyreModel.baseTyre,
              selectedTyre,
              () => selectTyre(tyre)))}
  </div>
);

const tyresTab = (session, selectedDriver, paceModel, selectedTyre, selectTyre) => (
  <div className="model-content">
    <div className="model-content-table">
      <div className="model-plot">
        <TyreModelComponent session={session} selectedDriver={selectedDriver} tyre={selectedTyre} />
      </div>
      <div className="model-info">
        {tyreChooser(session, paceModel, selectedTyre, selectTyre)}
      </div>
    </div>
  </div>
);

const tabContent = (selectedTab, session, selectedDriver, paceModel, selectedTyre, selectTyre) => {
  if (selectedTab === 'fuel') {
    return fuelTab(session, selectedDriver, paceModel);
  }
  if (selectedTab === 'tyres') {
    return tyresTab(session, selectedDriver, paceModel, selectedTyre, selectTyre);
  }
  return (<div />);
};

const tab = (selectedTab, tabName, tabTitle, onClick) => (
  <li className={selectedTab === tabName ? 'active' : ''}>
    <a onClick={onClick} tabIndex="-1">{tabTitle}</a>
  </li>
);

const ModellingContainer = ({ session, selectedDriver, showTyreDeg, selectedTab,
  showFuelEffect, selectedTyre, selectTyre }) => {
  const isOffline = session.get('isOffline');
  // only show fuel effect & tyre deg for offline sessions
  if (!isOffline) {
    return (<div />);
  }
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

      {tabContent(selectedTab, session, selectedDriver, paceModel, selectedTyre, selectTyre)}
    </div>
  );
};

ModellingContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
  showTyreDeg: PropTypes.func.isRequired,
  showFuelEffect: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired,
  selectedTyre: PropTypes.string.isRequired,
  selectTyre: PropTypes.func.isRequired,
};

ModellingContainer.defaultProps = {
  selectedDriver: '',
};

function mapStateToProps(state) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver.get('selectedDriver'),
    selectedTab: state.modelling.get('selectedTab'),
    selectedTyre: state.modelling.get('selectedTyre'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showFuelEffect: () => dispatch(selectModellingTab('fuel')),
    showTyreDeg: () => dispatch(selectModellingTab('tyres')),
    selectTyre: tyre => dispatch(selectModellingTyre(tyre)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModellingContainer);
