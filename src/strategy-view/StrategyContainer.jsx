import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { updateDriverStrategy, updateOpponentStrategy } from './strategy-actions';
import sliderCss from '../css/bootstrap-slider.min.css'; // eslint-disable-line no-unused-vars
import TabContainer from '../tabs/TabContainer';
import Tab from '../tabs/Tab';

function emptyTableRow() {
  const cells = [...Array(23).keys()]
    .map(i => (<td key={i} />));
  return (<tr key="empty">
    {cells}
  </tr>);
}

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
    <td />
    <td />
    {cells}
  </tr>);
}

function makeStrategyTableRows() {
  return [...Array(21).keys()].map(lap => makeRow(lap + 1));
}

function showAsLapsUntil(laps) {
  if (laps > 20) {
    return '>20 laps';
  }
  if (laps > 1) {
    return `${laps} laps`;
  }
  return '1 lap';
}

function driverSummaryRow(lapsUntilDriverStops, selectedDriver) {
  return (
    <tr key="driver-summary">
      <td />
      <td />
      <td colSpan="21">
        <div className="driver-strategy-summary">
          {showAsLapsUntil(lapsUntilDriverStops)} <br />
          until {selectedDriver} stops
        </div>
      </td>
    </tr>
  );
}

function driverSliderRow(lapsUntilDriverStops, onDriverStrategyChange) {
  return (
    <tr key="driver-slider">
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
  );
}

function opponentSummaryRow(lapsUntilOpponentStops, selectedOpponent) {
  return (
    <tr key="opponent-summary">
      <td rowSpan="24">
        <div className="opponent-strategy-summary">
          {showAsLapsUntil(lapsUntilOpponentStops)} <br />
          until {selectedOpponent} stops
        </div>
      </td>
    </tr>
  );
}

function opponentSliderRow(lapsUntilOpponentStops, onOpponentStrategyChange) {
  return (
    <tr key="opponent-slider">
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
  );
}

const StrategyContainer = ({ session, onDriverStrategyChange, onOpponentStrategyChange,
  lapsUntilDriverStops, lapsUntilOpponentStops, selectedDriver, selectedOpponent }) => {
  const isOffline = session.get('isOffline');
  // only show strategy container in live mode
  if (isOffline) {
    return (<div />);
  }

  const rows = [];

  if (selectedDriver !== '') {
    rows.push(driverSummaryRow(lapsUntilDriverStops, selectedDriver));
    rows.push(driverSliderRow(lapsUntilDriverStops, onDriverStrategyChange));

    if (selectedOpponent !== '') {
      rows.push(makeHeaderRow());
      rows.push(opponentSummaryRow(lapsUntilOpponentStops, selectedOpponent));
      rows.push(opponentSliderRow(lapsUntilOpponentStops, onOpponentStrategyChange));

      const strategyTableRows = makeStrategyTableRows();
      strategyTableRows.forEach(r => rows.push(r));
    } else {
      rows.push(emptyTableRow());
    }
  }

  return (
    <TabContainer>
      <Tab title="strategy">
        <div className="strategy-container">
          <table>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </Tab>
    </TabContainer>
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
