import React from 'react';
import { PropTypes } from 'prop-types';

function pad(v) {
  if (isNaN(v)) {
    return '--';
  }
  if (v >= 10) {
    return v;
  }
  return `0${v}`;
}
function toTimeOfDay(time) {
  const timeWithinDay = time % (60 * 60 * 24);
  const hour = Math.floor(timeWithinDay / (60 * 60));
  const minute = Math.floor(timeWithinDay / 60) % 60;
  const seconds = timeWithinDay % 60;
  return `${pad(hour)}:${pad(minute)}:${pad(seconds)}`;
}

const Page1 = ({ time }) => (
  <div className="time-of-day">{toTimeOfDay(time)}
  </div>
  );

Page1.propTypes = {
  time: PropTypes.string.isRequired,
};

export default Page1;
