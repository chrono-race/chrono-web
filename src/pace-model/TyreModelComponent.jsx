import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import $ from 'jquery';
import flot from 'flot-for-node'; // eslint-disable-line no-unused-vars
import { tyreCode } from '../session-data/tyres';

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

function fuelPaceCorrect(lap, paceModel, selectedDriver) {
  const fuelEffect = paceModel.fuelEffect;
  const pace = paceModel.driverModel[selectedDriver];
  const tyreOffset = lap.tyre === paceModel.tyreModel.baseTyre
    ? 0
    : paceModel.tyreModel.delta[lap.tyre];
  const lapTime = lap.lapTime - tyreOffset - pace - (lap.raceLapIndex * fuelEffect);
  return [lap.stintLapIndex + 1, lapTime];
}

function getDriverFuelCorrectedLapTimes(freeAirLaps, paceModel, selectedDriver) {
  if (selectedDriver === '') {
    return [];
  }

  const driverFreeAirLaps = freeAirLaps.get(selectedDriver);

  return driverFreeAirLaps.map(lap => fuelPaceCorrect(lap, paceModel, selectedDriver));
}

function degLine(tyreCorrectedLaps, deg) {
  const minLap = Math.min(...tyreCorrectedLaps.map(l => l[0]));
  const maxLap = Math.max(...tyreCorrectedLaps.map(l => l[0]));

  const deltaX = maxLap - minLap;

  const minY = 0;
  const maxY = deg * deltaX;

  return [[minLap, minY], [maxLap, maxY]];
}

class TyreModelComponent extends React.Component {
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
    const allFreeAirLaps = this.props.session.get('freeAirLaps');
    const selectedTyre = this.props.tyre;

    const tyreFreeAirLaps = allFreeAirLaps
      .map(laps => laps.filter(lap => lap.tyre === selectedTyre));

    const driverList = tyreFreeAirLaps
      .filter(laps => laps.length > 1)
      .map((laps, driver) => driver).toArray();

    const fuelCorrectedLapTimes = [];
    driverList.forEach((driver) => {
      getDriverFuelCorrectedLapTimes(tyreFreeAirLaps, paceModel, driver)
        .forEach(lap => fuelCorrectedLapTimes.push(lap));
    });


    const chartData = [];
    chartData.push(
      {
        data: fuelCorrectedLapTimes,
        points: {
          show: true,
          radius: 2,
          symbol: 'circle',
          lineWidth: 0,
          fillColor: '#6666FF',
        },
      },
    );
    if (this.props.selectedDriver !== '') {
      chartData.push(
        {
          data: getDriverFuelCorrectedLapTimes(tyreFreeAirLaps, paceModel, this.props.selectedDriver),
          points: {
            show: true,
            radius: 2,
            symbol: 'circle',
            lineWidth: 0,
            fillColor: '#FFFF00',
          },
        },
    );
    }
    chartData.push(
      {
        label: `&nbsp;${tyreCode(selectedTyre)} tyre deg`,
        data: degLine(fuelCorrectedLapTimes, paceModel.tyreModel.deg[selectedTyre]),
        lines: {
          lineWidth: 0.5,
        },
        color: '#00FF00',
      },
    );

    const chartOptions = createChartOptions();

    this.plot = $.plot(this.refs.fuelPlotContainer, chartData, chartOptions);
  }
  render() {
    return (
      <div className="plot-container" ref="fuelPlotContainer" />
    );
  }
}

TyreModelComponent.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedDriver: PropTypes.string,
  tyre: PropTypes.string.isRequired,
};

TyreModelComponent.defaultProps = {
  selectedDriver: '',
};

export default TyreModelComponent;
