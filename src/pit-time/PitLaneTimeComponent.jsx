import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';

const heading = (title, sortBy, sortField, currentSortField) => {
  const sortSymbol = sortField === currentSortField
    ? (<div className="sort-symbol">&darr;</div>)
    : (<div className="sort-symbol">&nbsp;</div>);
  return (
    <a onClick={() => sortBy(sortField)} tabIndex="-1">{title} {sortSymbol}</a>
  );
};

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
    <div>
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
  );
};

PitLaneTime.propTypes = {
  pitLaneTimes: PropTypes.instanceOf(Immutable.List).isRequired,
  sortBy: PropTypes.func.isRequired,
  sortColumn: PropTypes.string.isRequired,
};

export default PitLaneTime;
