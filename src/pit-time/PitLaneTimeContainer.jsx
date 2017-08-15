import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as actions from './pit-time-actions';
import PitLaneTime from './PitLaneTimeComponent';

const PitLaneTimeContainer = ({ pitLaneTimes, sortBy, sortColumn }) => (
  <PitLaneTime pitLaneTimes={pitLaneTimes} sortBy={sortBy} sortColumn={sortColumn} />
);

PitLaneTimeContainer.propTypes = {
  pitLaneTimes: PropTypes.instanceOf(Immutable.List).isRequired,
  sortBy: PropTypes.func.isRequired,
  sortColumn: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    pitLaneTimes: state.session.get('pitLaneTimes').toList(),
    sortColumn: state.pitTime.get('sortByColumn'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sortBy: column => dispatch(actions.sortPitLaneTimes(column)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PitLaneTimeContainer);
