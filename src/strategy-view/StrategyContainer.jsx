import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import { updateStrategies } from './strategy-actions';

function makeCell(driverLap, opponentLap, setStrategy) {
  return (
    <td key={`${driverLap}-${opponentLap}`}>
      <a tabIndex="-1" onClick={() => setStrategy(driverLap, opponentLap)}>{driverLap}/{opponentLap}</a>
    </td>);
}

function makeRow(driverLap, setStrategy) {
  const cells = [...Array(21).keys()]
    .map(opponentLap => makeCell(driverLap, opponentLap, setStrategy));
  return (<tr key={driverLap}>
    <th>{driverLap}</th>
    {cells}
  </tr>);
}

function makeHeaderRow() {
  const cells = [...Array(21).keys()]
    .map(lap => (<th>{lap + 1}</th>));
  return (<tr key="header">
    <td />
    {cells}
  </tr>);
}

function makeRows(setStrategy) {
  const headerRow = makeHeaderRow();
  const rows = [...Array(21).keys()].map(lap => makeRow(lap + 1, setStrategy));
  return [headerRow, ...rows];
}

const StrategyContainer = ({ session, setStrategy }) => {
  const isOffline = session.get('isOffline');
  // only show strategy container in live mode
  if (isOffline) {
    return (<div />);
  }

  const rows = makeRows(setStrategy);

  return (
    <div className="strategy-container">
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

StrategyContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  setStrategy: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    session: state.session,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setStrategy: (driverLap, opponentLap) => dispatch(updateStrategies(driverLap, opponentLap)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StrategyContainer);
