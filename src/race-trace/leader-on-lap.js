
function leaderOnLap(times, lapIndex) {
  return times.keySeq().minBy(driverName => times.get(driverName).get(lapIndex));
}

export default leaderOnLap;
