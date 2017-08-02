import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { tyreCode } from '../session-data/tyres';
import FuelModelComponent from './FuelModelComponent';
import TyreModelComponent from './TyreModelComponent';
import * as actions from './model-actions';

const toFixed = (num) => {
  if (num < 0) {
    return num.toFixed(3);
  }
  return `+${num.toFixed(3)}`;
};

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

const tyreChoice = (tyre, deg, delta, baseTyre, selectedTyre, onSelect) => {
  let className = 'btn btn-primary btn-xs btn-block tyre-button';
  let rowClassName = 'tyre-row';
  if (selectedTyre === tyre) {
    className += ' active';
    rowClassName = 'active-tyre';
  }
  // eslint-disable-next-line
  return (<tr key={tyre} className={rowClassName} onClick={onSelect}>
    <td>
      <a className={className} onClick={onSelect} tabIndex="-3">
        {tyreCode(tyre)}
      </a>
    </td>
    <td>
      <div className="model-tyre-deg">{toFixed(deg)} sec/lap</div>
      <div className="model-tyre-delta">{deltaIfAny(delta, baseTyre)}</div>
    </td>
  </tr>
  );
};

const getDelta = (tyre, deltaMap, baseTyre) => {
  if (tyre === baseTyre) {
    return undefined;
  }
  return deltaMap[tyre];
};

const tyreChooser = (session, paceModel, selectedTyre, selectTyre) => (
  <table>
    {Object.keys(paceModel.tyreModel.deg)
           .map(tyre => tyreChoice(
              tyre,
              paceModel.tyreModel.deg[tyre],
              getDelta(tyre, paceModel.tyreModel.delta, paceModel.tyreModel.baseTyre),
              paceModel.tyreModel.baseTyre,
              selectedTyre,
              () => selectTyre(tyre)))}
  </table>
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
