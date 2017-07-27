import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import FuelModelComponent from './FuelModelComponent';

const ModellingContainer = ({ session, selectedDriver }) => {
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
          <li className="active">
            <a href="#fuel" data-toggle="tab">Fuel Effect</a>
          </li>
          <li>
            <a href="#tyres" data-toggle="tab">Tyre Deg</a>
          </li>
        </ul>
      </div>

      <div className="model-content">
        <div className="model-content-table">
          <div className="model-plot">
            <FuelModelComponent session={session} selectedDriver={selectedDriver} />
          </div>
          <div className="model-info">
            Deg params
          </div>
        </div>
      </div>
    </div>
  );
};

ModellingContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
};

ModellingContainer.defaultProps = {
  selectedDriver: '',
};

function mapStateToProps(state) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver.get('selectedDriver'),
  };
}

export default connect(mapStateToProps)(ModellingContainer);
