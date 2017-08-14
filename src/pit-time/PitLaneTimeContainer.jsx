import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import PitLaneTime from './PitLaneTimeComponent';

const PitLaneTimeContainer = ({ session }) => (
  <PitLaneTime session={session} />
);

PitLaneTimeContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
};

function mapStateToProps(state) {
  return {
    session: state.session,
  };
}

export default connect(mapStateToProps)(PitLaneTimeContainer);
