import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import $ from 'jquery';
import flot from 'flot-for-node'; // eslint-disable-line no-unused-vars
import normaliseTimes from './normalise-times';
import plotStructure from './plot-structure';

function createChartOptions(minMax) {
  return {
    xaxis: {
      show: true,
      color: 'white',
      tickColor: 'white',
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
    return {
      min,
      max,
    };
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
    const w = $(window).width();
    const h = $(window).height();
    $(this.refs.plotContainer).width(w * 0.48);
    $(this.refs.plotContainer).height(h * 0.44);

    const session = this.props.session;
    const normalTimes = normaliseTimes(session);
    const chartData = plotStructure(normalTimes, session.get('drivers'), this.props.selectedDriver, this.props.selectedOpponent);
    const chartOptions = createChartOptions(findMinMax(normalTimes, this.props.selectedDriver, this.props.selectedOpponent));

    if (chartData.length === 0) {
      return;
    }

    this.plot = $.plot(this.refs.plotContainer, chartData, chartOptions);
  }
  render() {
    return (
      <div className="race-trace" ref="plotContainer" />
    );
  }
}

RaceTraceComponent.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
  selectedOpponent: PropTypes.string,
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
  };
}

export default connect(mapStateToProps)(RaceTraceComponent);
