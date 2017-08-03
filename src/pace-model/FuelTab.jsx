import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import FuelModelComponent from './FuelModelComponent';

const toFixed = (num) => {
  if (num < 0) {
    return num.toFixed(3);
  }
  return `+${num.toFixed(3)}`;
};

const FuelTab = ({ session, selectedDriver, paceModel }) => (
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

FuelTab.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string.isRequired,
  paceModel: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default FuelTab;
