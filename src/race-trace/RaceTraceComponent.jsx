import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import flot from 'flot-for-node'; // eslint-disable-line no-unused-vars
import normaliseTimes from './normalise-times';
import plotStructure from './plot-structure';

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

    const chartOptions = {
      xaxis: {
        show: true,
        color: 'white',
        tickColor: 'white',
        font: {
          size: 11,
          lineHeight: 13,
          family: 'sans-serif',
          variant: 'small-caps',
          color: '#CCCCCC',
        },
      },
      yaxis: {
        show: true,
        color: 'white',
        tickColor: 'white',
        min: -10,
        max: 50,
        font: {
          size: 11,
          lineHeight: 13,
          family: 'sans-serif',
          variant: 'small-caps',
          color: '#CCCCCC',
        },
      },
      lines: {
        lineWidth: 0.5,
      },
      grid: {
        borderWidth: 0,
        xhoverable: true,
        xclickable: true,
      },
      legend: {
        backgroundColor: 'transparent',
      },
    };
    // const chartData = [
    //   {
    //     label: 'VET',
    //     shadowSize: 0,
    //     xlines: { lineWidth: 5 },
    //     color: '#FF0000',
    //     data: [[0, 3], [10, 30], [20, 45], [30, 40]],
    //   },
    //   {
    //     label: 'HAM',
    //     shadowSize: 0,
    //     color: '#CCCCCC',
    //     data: [[0, 2], [10, 28], [20, 47], [30, 41]],
    //   }];
    const session = this.props.session;
    const normalTimes = normaliseTimes(session);
    const chartData = plotStructure(normalTimes, this.props.selectedDriver, this.props.selectedOpponent);

    if (chartData.length === 0) {
      return;
    }

    // $(this.refs.plotContainer).unbind('plothover', this.plotHover.bind(this));
    this.plot = $.plot(this.refs.plotContainer, chartData, chartOptions);
    // $(this.refs.plotContainer).bind('plothover', this.plotHover.bind(this));
  }
  // plotHover(event, pos, item) {
  //   if (item !== null) {
  //     console.log(`hover on ${JSON.stringify(item)}`);
  //     item.series.lines.width = 5;
  //     this.plot.draw();
  //   }
  // }
  render() {
    return (
      <div className="race-trace" ref="plotContainer" />
    );
  }
}

function mapStateToProps(state) {
  return {
    session: state.session,
    selectedDriver: state.selectedDriver.get('selectedDriver'),
    selectedOpponent: state.selectedDriver.get('selectedOpponent'),
  };
}

export default connect(mapStateToProps)(RaceTraceComponent);
