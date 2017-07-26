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
    <div className="table-container">
      <div>
        <ul className="nav nav-tabs">
          <li className="active">
            <a href="#fuel" data-toggle="tab">Fuel Effect</a>
          </li>
          <li>
            <a href="#tyres" data-toggle="tab">Tyre Deg</a>
          </li>
        </ul>
      </div>

      <div className="tab-content table-row">
        <div className="tab-pane active full-height" id="fuel">
          <FuelModelComponent session={session} selectedDriver={selectedDriver} />
        </div>
        <div className="tab-pane" id="tyres">
          Tyre deg!
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
