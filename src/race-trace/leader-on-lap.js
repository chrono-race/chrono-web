
function ignoreNaN(time) {
  if (isNaN(time)) {
    return +Infinity;
  }
  return time;
}

function leaderOnLap(times, lapIndex) {
  return times.keySeq().minBy(driverName => ignoreNaN(times.get(driverName).get(lapIndex)));
}

export default leaderOnLap;
