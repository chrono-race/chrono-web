import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as actions from './model-actions';
import FuelTab from './FuelTab';
import TyresTab from './TyresTab';

const modelHelp = (show, selectedTab) => {
  if (!show) {
    return (<div />);
  }
  let help = '';
  switch (selectedTab) {
    case 'fuel':
      help = (<span>This plot shows&nbsp;
                <span
                  className="help-tooltip"
                  data-toggle="tooltip"
                  title="laps where a driver is neither following nor being followed by another, within 2 seconds" // eslint-disable-line
                >
                    free air laptimes
                </span>,
                corrected for&nbsp;
                <span
                  className="help-tooltip"
                  data-toggle="tooltip"
                  title="laptimes are decreased to offset the effect of tyre age and delta to the quickest tyre (see tyre deg tab)" // eslint-disable-line
                >
                  tyre
                </span>&nbsp;
                and&nbsp;
                <span
                  className="help-tooltip"
                  data-toggle="tooltip"
                  title="differences in underlying driver pace are normalized so that each driver's initial model laptime on the quickest tyre is 0 sec"  // eslint-disable-line
                >
                  driver pace
                </span>,&nbsp;
                against lap number.
                Model laptime starts at zero and reduces each lap as fuel (weight) reduces.
                The line shows average fuel effect, this gradient is how much faster
                each lap is due to the fuel effect (ignoring tyre wear).</span>);
      break;
    case 'tyres':
      help = (<span>
                This plot shows&nbsp;
                <span
                  className="help-tooltip"
                  data-toggle="tooltip"
                  title="laps where a driver is neither following nor being followed by another, within 2 seconds" // eslint-disable-line
                >
                    free air laptimes
                </span>,
                corrected for&nbsp;
                <span
                  className="help-tooltip"
                  data-toggle="tooltip"
                  title="laptimes are increased to offset the effect of burning off fuel (see fuel tab)" // eslint-disable-line
                >
                fuel effect
                </span>&nbsp;
                and&nbsp;
                <span
                  className="help-tooltip"
                  data-toggle="tooltip"
                  title="differences in underlying driver pace are normalized so that each driver's initial model laptime is 0 sec" // eslint-disable-line
                >
                  driver pace
                </span>,&nbsp;
                against tyre age for each type of tyre.
                Model laptime starts at zero and increases as tyres age.
                The line shows average tyre deg, i.e. how much slower each lap is due to tyre age.
                This value &amp; the pace difference to the quickest tyre are shown.
      </span>);
      break;
    default:
      break;
  }
  return (
    <div className="model-help">
      <div className="alert alert-info">{help}</div>
    </div>
  );
};

const tabContent = (selectedTab, session, selectedDriver, paceModel, selectedTyre, selectTyre) => {
  if (selectedTab === 'fuel') {
    return (<FuelTab session={session} selectedDriver={selectedDriver} paceModel={paceModel} />);
  }
  if (selectedTab === 'tyres') {
    return (<TyresTab
      session={session} selectedDriver={selectedDriver} paceModel={paceModel}
      selectedTyre={selectedTyre} selectTyre={selectTyre}
    />);
  }
  return (<div />);
};

const tab = (selectedTab, tabName, tabTitle, onClick) => (
  <li className={selectedTab === tabName ? 'active' : ''}>
    <a onClick={onClick} tabIndex="-1">{tabTitle}</a>
  </li>
);

const ModellingContainer = ({ session, selectedDriver, showTyreDeg, selectedTab,
  showFuelEffect, selectedTyre, selectTyre, showModelHelp, onToggleModelHelp }) => {
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
        <a onClick={onToggleModelHelp} tabIndex="-2">
          <span
            className="glyphicon glyphicon-info-sign"
            style={{ float: 'right', cursor: 'pointer' }}
          />
        </a>
        <ul className="nav nav-tabs">
          {tab(selectedTab, 'fuel', 'Fuel Effect', showFuelEffect)}
          {tab(selectedTab, 'tyres', 'Tyre Deg', showTyreDeg)}
        </ul>
      </div>
      {modelHelp(showModelHelp, selectedTab)}
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
  showModelHelp: PropTypes.bool.isRequired,
  onToggleModelHelp: PropTypes.func.isRequired,
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
    showModelHelp: state.modelling.get('showModelHelp'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showFuelEffect: () => dispatch(actions.selectModellingTab('fuel')),
    showTyreDeg: () => dispatch(actions.selectModellingTab('tyres')),
    selectTyre: tyre => dispatch(actions.selectModellingTyre(tyre)),
    onToggleModelHelp: () => dispatch(actions.toggleModelHelp()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModellingContainer);
