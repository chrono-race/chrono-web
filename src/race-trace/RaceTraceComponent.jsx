import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import $ from 'jquery';
import flot from 'flot-for-node'; // eslint-disable-line no-unused-vars
import normaliseTimes from './normalise-times';
import plotStructure from './plot-structure';
import toTimeStructure from './time-structure';
import findSlowLapNumbers from './find-slow-laps';
import projectForwards from './project-forwards';

function createChartOptions(minMax, totalLaps) {
  return {
    xaxis: {
      show: true,
      color: 'white',
      tickColor: 'white',
      min: 1,
      max: totalLaps,
      font: {
        size: 10,
        lineHeight: 13,
        family: 'Lato,Helvetica Neue,Helvetica,Arial,sans-serif',
        variant: 'small-caps',
        color: '#CCCCCC',
      },
    },
    yaxis: {
      show: true,
      color: 'white',
      tickColor: 'white',
      min: minMax.min,
      max: minMax.max,
      font: {
        size: 10,
        lineHeight: 13,
        family: 'Lato,Helvetica Neue,Helvetica,Arial,sans-serif',
        variant: 'small-caps',
        color: '#CCCCCC',
      },
    },
    lines: {
      lineWidth: 0.5,
    },
    grid: {
      borderWidth: 0.5,
      borderColor: 'white',
      xhoverable: true,
      xclickable: true,
    },
    legend: {
      backgroundColor: 'transparent',
    },
  };
}

function findMinMax(times, selectedDriver, selectedOpponent) {
  if (selectedDriver !== '') {
    const driverTimes = times.get(selectedDriver).filter(t => !isNaN(t));
    let min = driverTimes.min();
    let max = driverTimes.max();
    if (selectedOpponent !== '') {
      min = Math.min(min, times.get(selectedOpponent).filter(t => !isNaN(t)).min());
      max = Math.max(max, times.get(selectedOpponent).filter(t => !isNaN(t)).max());
    }
    if (!isNaN(min) && !isNaN(max)) {
      return {
        min,
        max,
      };
    }
  }
  if (times.keySeq().length === 0) {
    return {
      min: -5,
      max: 50,
    };
  }
  const allTimes = times.valueSeq().flatMap(v => v).filter(t => !isNaN(t));
  return {
    min: allTimes.min(),
    max: allTimes.max(),
  };
}

function calcNowLine(originalTimes, normalTimes) {
  return originalTimes.map((driver, key) => {
    const lastLap = driver.findLastIndex(t => !isNaN(t));
    return {
      time: normalTimes.get(key).get(lastLap),
      laps: lastLap + 1,
    };
  })
    .filter(p => p.laps > 1)
    .sortBy(p => p.time)
    .map(p => [p.laps, p.time]);
}

class RaceTraceComponent extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.renderPlot();
  }
  componentDidUpdate() {
    this.renderPlot();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }
  updateDimensions() {
    this.renderPlot();
  }
  renderPlot() {
    const session = this.props.session;
    const strategies = this.props.strategies;
    const selectedDriver = this.props.selectedDriver;
    const selectedOpponent = this.props.selectedOpponent;

    const pitStops = {};
    if (selectedDriver !== '') {
      pitStops[selectedDriver] = strategies.get('lapsUntilDriverStop');
    }
    if (selectedOpponent !== '') {
      pitStops[selectedOpponent] = strategies.get('lapsUntilOpponentStop');
    }

    const pitModelParams = {
      timeLostInPits: 20,
      newTyreLaptimeDelta: -1,
      overtakePaceDelta: 1.7,
    };

    const originalTimes = toTimeStructure(session);
    const slowLapNumbers = findSlowLapNumbers(originalTimes);

    const times = projectForwards(originalTimes, session.get('drivers'), 20, pitStops, pitModelParams, slowLapNumbers);

    const normalTimes = normaliseTimes(times, slowLapNumbers);

    const chartData = plotStructure(normalTimes, session.get('drivers'), selectedDriver, selectedOpponent);
    const minMax = findMinMax(normalTimes, selectedDriver, selectedOpponent);
    const chartOptions = createChartOptions(minMax, session.get('totalLaps'));

    const nowLine = calcNowLine(originalTimes, normalTimes).toArray();
    if (nowLine.length > 0) {
      const lastNowLap = nowLine[nowLine.length - 1][0];
      nowLine.push([lastNowLap, minMax.max]);
      const firstNowLap = nowLine[0][0];
      nowLine.unshift([firstNowLap, minMax.min]);
    }

    const barData = [];
    slowLapNumbers.forEach((lapNumber) => {
      barData.push([lapNumber, minMax.max]);
    });

    chartData.push({
      data: barData,
      bars: {
        show: true,
        barWidth: 1,
        lineWidth: 0,
        fill: 0.1,
        alight: 'left',
      },
    });

    chartData.push({
      data: nowLine,
      color: '#FFFFAA',
      lines: {
        lineWidth: 0.5,
      },
    });

    if (chartData.length === 0) {
      return;
    }

    this.plot = $.plot(this.refs.plotContainer, chartData, chartOptions);
  }
  render() {
    return (
      <div className="plot-container" ref="plotContainer" />
    );
  }
}

RaceTraceComponent.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
  selectedOpponent: PropTypes.string,
  strategies: PropTypes.instanceOf(Immutable.Map).isRequired,
};

RaceTraceComponent.defaultProps = {
  selectedDriver: '',
  selectedOpponent: '',
};

function mapStateToProps(state) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver.get('selectedDriver'),
    selectedOpponent: state.selectedDriver.get('selectedOpponent'),
    strategies: state.strategies,
  };
}

export default connect(mapStateToProps)(RaceTraceComponent);
