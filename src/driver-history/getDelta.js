
function getDelta(driver, opponent, lapNumber) {
  if (driver === undefined || opponent === undefined) {
    return '';
  }
  if (driver.get('cumulativeTime').count() < lapNumber ||
    opponent.get('cumulativeTime').count() < lapNumber) {
    return '';
  }
  const driverCumTime = driver.get('cumulativeTime').get(lapNumber - 1);
  const opponentCumTime = opponent.get('cumulativeTime').get(lapNumber - 1);
  if (isNaN(driverCumTime) || isNaN(opponentCumTime)) {
    return '';
  }
  return `${(driverCumTime - opponentCumTime).toFixed(3)}`;
}

export default getDelta;
