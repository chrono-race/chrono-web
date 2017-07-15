import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import $ from 'jquery';
import flot from 'flot-for-node'; // eslint-disable-line no-unused-vars

function createChartOptions() {
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

function fuelCorrect(lap, paceModel, selectedDriver) {
  let tyreDeg = paceModel.tyreModel[lap.tyre];
  if (paceModel.drivers[selectedDriver] !== undefined &&
      paceModel.drivers[selectedDriver].tyreModel[lap.tyre] !== undefined) {
    tyreDeg = paceModel.drivers[selectedDriver].tyreModel[lap.tyre].gain;
  }
  const lapTime = lap.lapTime - (lap.stintLapIndex * tyreDeg);
  return [lap.raceLapIndex + 1, lapTime];
}

function getDriverTyreCorrectedLapTimes(session, paceModel, selectedDriver) {
  if (selectedDriver === '') {
    return [];
  }

  const driverFreeAirLaps = session.get('freeAirLaps').get(selectedDriver);

  return driverFreeAirLaps.map(lap => fuelCorrect(lap, paceModel, selectedDriver));
}

function degLine(tyreCorrectedLaps, deg) {
  const minLapTime = Math.min(...tyreCorrectedLaps.map(l => l[1]));
  const maxLapTime = Math.max(...tyreCorrectedLaps.map(l => l[1]));

  const minLap = Math.min(...tyreCorrectedLaps.map(l => l[0]));
  const maxLap = Math.max(...tyreCorrectedLaps.map(l => l[0]));

  const midY = (minLapTime + maxLapTime) / 2;
  const halfX = (minLap + maxLap) / 2;

  const minY = midY - (deg * halfX);
  const maxY = midY + (deg * halfX);

  return [[minLap, minY], [maxLap, maxY]];
}

class FuelModelComponent extends React.Component {
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
    const paceModel = this.props.session.get('paceModel');
    const tyreCorrectedLapTimes = getDriverTyreCorrectedLapTimes(this.props.session,
      paceModel, this.props.selectedDriver);

    const chartData = [];
    if (this.props.selectedDriver !== '') {
      chartData.push(
        {
          data: tyreCorrectedLapTimes,
          points: {
            show: true,
            radius: 2,
            symbol: 'circle',
            lineWidth: 0,
            fillColor: '#FF0000',
          },
        },
      );
      const driverModel = paceModel.drivers[this.props.selectedDriver];
      if (driverModel !== undefined && driverModel.meanSquaredError < 0.5) {
        chartData.push(
          {
            label: `&nbsp;${this.props.selectedDriver} fuel effect`,
            data: this.props.selectedDriver === ''
              ? []
              : degLine(tyreCorrectedLapTimes, driverModel.fuelEffect),
            lines: {
              lineWidth: 0.5,
            },
            color: '#FF0000',
          },
        );
      } else {
        chartData.push(
          {
            label: '&nbsp;Avg fuel effect',
            data: degLine(tyreCorrectedLapTimes, paceModel.fuelEffect),
            lines: {
              lineWidth: 0.5,
            },
            color: '#6666FF',
          },
        );
      }
    }

    const chartOptions = createChartOptions();

    // if (chartData.length === 0) {
    //   return;
    // }

    this.plot = $.plot(this.refs.fuelPlotContainer, chartData, chartOptions);
  }
  render() {
    return (
      <div className="plot-container" ref="fuelPlotContainer" />
    );
  }
}

FuelModelComponent.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
};

FuelModelComponent.defaultProps = {
  selectedDriver: '',
};

export default FuelModelComponent;
