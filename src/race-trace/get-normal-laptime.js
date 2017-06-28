
function ignoreNaNs(time) {
  if (isNaN(time)) {
    return +Infinity;
  }
  return time;
}
function getNormalLaptime(session) {
  const lapCount = session.get('drivers').map(d => d.get('cumulativeTime').count()).max();
  const minCumulativeTime = session.get('drivers')
    .map(d => ignoreNaNs(d.get('cumulativeTime').get(lapCount - 1)))
    .min();
  return minCumulativeTime / (lapCount - 1);
}

export default getNormalLaptime;
