import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { updateDriverStrategy, updateOpponentStrategy } from './strategy-actions';
import sliderCss from '../css/bootstrap-slider.min.css'; // eslint-disable-line no-unused-vars

function makeCell(driverLap, opponentLap) {
  return (
    <td key={`${driverLap}-${opponentLap}`} />);
}

function makeRow(driverLap) {
  const cells = [...Array(21).keys()]
    .map(opponentLap => makeCell(driverLap, opponentLap));
  if (driverLap % 5 === 1) {
    if (driverLap < 20) {
      cells.splice(0, 0, (<th key={driverLap} rowSpan="5" className="side">{driverLap + 4}</th>));
    } else {
      cells.splice(0, 0, (<th key={driverLap} />));
    }
  }
  return (<tr key={driverLap}>
    {cells}
  </tr>);
}

function makeHeaderRow() {
  const cells = [...Array(4).keys()]
    .map(lap => (<th key={lap} colSpan="5" className="top">{(lap * 5) + 5}</th>));
  return (<tr key="header">
    <td />
    {cells}
  </tr>);
}

function makeRows() {
  const headerRow = makeHeaderRow();
  const rows = [...Array(21).keys()].map(lap => makeRow(lap + 1));
  return [headerRow, ...rows];
}

function showAsLapsUntil(laps) {
  if (laps > 20) {
    return '>20';
  }
  return laps;
}

const StrategyContainer = ({ session, onDriverStrategyChange, onOpponentStrategyChange,
  lapsUntilDriverStops, lapsUntilOpponentStops, selectedDriver, selectedOpponent }) => {
  const isOffline = session.get('isOffline');
  // only show strategy container in live mode
  if (isOffline) {
    return (<div />);
  }

  const rows = makeRows();

  return (
    <div className="strategy-container">
      <table>
        <tbody>
          <tr>
            <td />
            <td />
            <td colSpan="21">
              <div className="driver-strategy-summary">
                {showAsLapsUntil(lapsUntilDriverStops)} laps until {selectedDriver} stops
              </div>
            </td>
          </tr>
          <tr>
            <td />
            <td />
            <td colSpan="21">
              <div className="driver-lap-slider">
                <ReactBootstrapSlider
                  value={lapsUntilDriverStops}
                  min={1}
                  max={21}
                  change={e => onDriverStrategyChange(e.target.value)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td rowSpan="24">
              <div className="opponent-strategy-summary">
                {showAsLapsUntil(lapsUntilOpponentStops)} laps<br />
                until {selectedOpponent} stops
              </div>
            </td>
          </tr>
          <tr>
            <td rowSpan="24">
              <div className="opponent-lap-slider">
                <ReactBootstrapSlider
                  value={lapsUntilOpponentStops}
                  min={1}
                  max={21}
                  orientation="vertical"
                  change={e => onOpponentStrategyChange(e.target.value)}
                />
              </div>
            </td>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

StrategyContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  onDriverStrategyChange: PropTypes.func.isRequired,
  onOpponentStrategyChange: PropTypes.func.isRequired,
  lapsUntilDriverStops: PropTypes.number.isRequired,
  lapsUntilOpponentStops: PropTypes.number.isRequired,
  selectedDriver: PropTypes.string,
  selectedOpponent: PropTypes.string,
};

StrategyContainer.defaultProps = {
  selectedDriver: '',
  selectedOpponent: '',
};

function mapStateToProps(state) {
  return {
    session: state.session,
    lapsUntilDriverStops: state.strategies.get('lapsUntilDriverStop'),
    lapsUntilOpponentStops: state.strategies.get('lapsUntilOpponentStop'),
    selectedDriver: state.selectedDriver.get('selectedDriver'),
    selectedOpponent: state.selectedDriver.get('selectedOpponent'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDriverStrategyChange: lapsUntilStop => dispatch(updateDriverStrategy(lapsUntilStop)),
    onOpponentStrategyChange: lapsUntilStop => dispatch(updateOpponentStrategy(lapsUntilStop)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StrategyContainer);
