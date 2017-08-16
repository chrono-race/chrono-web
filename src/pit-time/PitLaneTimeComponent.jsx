import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import median from '../race-trace/median';

const heading = (title, sortBy, sortField, currentSortField) => {
  const sortSymbol = sortField === currentSortField
    ? (<div className="sort-symbol">&darr;</div>)
    : (<div className="sort-symbol">&nbsp;</div>);
  return (
    <a onClick={() => sortBy(sortField)} tabIndex="-1">{title} {sortSymbol}</a>
  );
};

const toFixedOrEmpty = (result) => {
  if (result === undefined) {
    return undefined;
  }
  return result.toFixed(3);
};

const minTime = pitLaneTimes => pitLaneTimes.map(t => t.timeLost).min();

const PitLaneTime = ({ pitLaneTimes, sortBy, sortColumn }) => {
  const times = pitLaneTimes.sortBy(x => x[sortColumn]);
  const rows = [];
  times.forEach((time) => {
    rows.push(
      (<tr key={time.lapNumber + time.driver}>
        <td>{time.lapNumber}</td>
        <td>{time.driver}</td>
        <td>{time.timeLost.toFixed(3)}</td>
      </tr>),
    );
  });
  return (
    <div className="pit-lane-container">
      <div className="pit-lane-times">
        <table className="pit-lane-time-table">
          <thead>
            <tr>
              <th>{heading('lap #', sortBy, 'lapNumber', sortColumn)}</th>
              <th>{heading('driver', sortBy, 'driver', sortColumn)}</th>
              <th>{heading('pit lane time', sortBy, 'timeLost', sortColumn)}</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
      <div className="pit-lane-info">
        <table className="pit-lane-stats-table">
          <tbody>
            <tr>
              <th>minimum</th>
              <td>{toFixedOrEmpty(minTime(pitLaneTimes))}</td>
            </tr>
            <tr>
              <th>median</th>
              <td>{toFixedOrEmpty(median(pitLaneTimes.map(t => t.timeLost).sort().toArray()))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

PitLaneTime.propTypes = {
  pitLaneTimes: PropTypes.instanceOf(Immutable.List).isRequired,
  sortBy: PropTypes.func.isRequired,
  sortColumn: PropTypes.string.isRequired,
};

export default PitLaneTime;
