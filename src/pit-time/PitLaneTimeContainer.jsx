import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as actions from './pit-time-actions';
import PitLaneTime from './PitLaneTimeComponent';

const PitLaneTimeContainer = ({ session, sortBy, sortColumn }) => (
  <PitLaneTime session={session} sortBy={sortBy} sortColumn={sortColumn}  />
);

PitLaneTimeContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
  sortBy: PropTypes.func.isRequired,
  sortColumn: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    session: state.session,
    sortColumn: state.pitTime.get('sortByColumn'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sortBy: column => dispatch(actions.sortPitLaneTimes(column)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PitLaneTimeContainer);
