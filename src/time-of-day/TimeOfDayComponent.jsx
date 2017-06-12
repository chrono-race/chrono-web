import React from 'react';
import { PropTypes } from 'prop-types';
import { toTimeOfDay } from '../session-data/timing-utils';

const Page1 = ({ time }) => (
  <div className="time-of-day">{toTimeOfDay(time)}
  </div>
  );

Page1.propTypes = {
  time: PropTypes.number.isRequired,
};

export default Page1;
