
function offsetTime(t, fromTime, offset) {
  if (t >= fromTime) {
    return t - offset;
  }
  return t;
}

function offsetTimesForDriver(driverTimes, fromTime, offset) {
  return driverTimes.map(t => offsetTime(t, fromTime, offset));
}

function offsetTimes(times, fromTime, offset) {
  return times.map(driverTimes => offsetTimesForDriver(driverTimes, fromTime, offset));
}

export default offsetTimes;
