import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { updateDriverStrategy, updateOpponentStrategy } from './strategy-actions';
import sliderCss from '../css/bootstrap-slider.min.css'; // eslint-disable-line no-unused-vars

function makeCell(driverLap, opponentLap) {
  return (
    <td key={`${driverLap}-${opponentLap}`}>
      x
    </td>);
}

function makeRow(driverLap) {
  const cells = [...Array(21).keys()]
    .map(opponentLap => makeCell(driverLap, opponentLap));
  return (<tr key={driverLap}>
    <th>{driverLap}</th>
    {cells}
  </tr>);
}

function makeHeaderRow() {
  const cells = [...Array(21).keys()]
    .map(lap => (<th key={lap}>{lap + 1}</th>));
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

const StrategyContainer = ({ session, onDriverStrategyChange, onOpponentStrategyChange }) => {
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
            <td colSpan="21">
              <div className="opponent-lap-slider">
                <ReactBootstrapSlider
                  value={21}
                  min={1}
                  max={21}
                  change={e => onDriverStrategyChange(e.target.value)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td rowSpan="23">
              <ReactBootstrapSlider
                value={21}
                min={1}
                max={21}
                orientation="vertical"
                change={e => onOpponentStrategyChange(e.target.value)}
              />
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
};

function mapStateToProps(state) {
  return {
    session: state.session,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDriverStrategyChange: lapsUntilStop => dispatch(updateDriverStrategy(lapsUntilStop)),
    onOpponentStrategyChange: lapsUntilStop => dispatch(updateOpponentStrategy(lapsUntilStop)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StrategyContainer);
