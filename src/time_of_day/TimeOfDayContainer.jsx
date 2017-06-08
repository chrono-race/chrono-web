import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import TimeOfDay from './TimeOfDayComponent';

const TimeOfDayContainer = ({ time }) => (
  <TimeOfDay time={time} />
);

TimeOfDayContainer.propTypes = {
  time: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    time: state.session.get('time'),
  };
}

export default connect(mapStateToProps)(TimeOfDayContainer);
