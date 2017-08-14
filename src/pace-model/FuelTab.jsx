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

const modelHelp = show => (!show ? (<div />) :
  (<div className="model-help">
    <div className="alert alert-info">
      <span>This plot shows&nbsp;
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
        each lap is due to the fuel effect (ignoring tyre wear).
      </span>
    </div>
  </div>));

const FuelTab = ({ session, selectedDriver, paceModel, showModelHelp }) => (
  <div className="model-table">
    {modelHelp(showModelHelp)}
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
  </div>
);

FuelTab.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string.isRequired,
  paceModel: PropTypes.instanceOf(Immutable.Map).isRequired,
  showModelHelp: PropTypes.bool.isRequired,
};

export default FuelTab;
