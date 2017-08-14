import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as actions from './model-actions';
import FuelTab from './FuelTab';
import TyresTab from './TyresTab';
import TabContainer from '../tabs/TabContainer';
import Tab from '../tabs/Tab';

const ModellingContainer = ({ session, selectedDriver,
  selectedTyre, selectTyre, showModelHelp, onToggleModelHelp }) => {
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
    <div>
      <TabContainer>
        <Tab title="fuel effect">
          <FuelTab
            session={session} selectedDriver={selectedDriver} paceModel={paceModel}
            showModelHelp={showModelHelp}
          />
        </Tab>
        <Tab title="tyre deg">
          <TyresTab
            session={session} selectedDriver={selectedDriver} paceModel={paceModel}
            selectedTyre={selectedTyre} selectTyre={selectTyre}
            showModelHelp={showModelHelp}
          />
        </Tab>
      </TabContainer>
      <a onClick={onToggleModelHelp} tabIndex="-2" className="tab-info-button">
        <span
          className="glyphicon glyphicon-info-sign"
        />
      </a>
    </div>
  );
};

ModellingContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
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
    selectedTyre: state.modelling.get('selectedTyre'),
    showModelHelp: state.modelling.get('showModelHelp'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectTyre: tyre => dispatch(actions.selectModellingTyre(tyre)),
    onToggleModelHelp: () => dispatch(actions.toggleModelHelp()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModellingContainer);
