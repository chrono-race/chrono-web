
function toLapNumberPairs(driverTimes) {
  return driverTimes.map((value, index) => [index + 1, value]).toArray();
}

function toDriverStructure(driver, normalTimes, highlight) {
  if (highlight) {
    return {
      label: driver,
      data: toLapNumberPairs(normalTimes.get(driver)),
      lines: {
        lineWidth: 2,
      },
    };
  }
  return {
    data: toLapNumberPairs(normalTimes.get(driver)),
  };
}

function plotStructure(normalTimes, selectedDriver, selectedOpponent) {
  return normalTimes.keySeq()
    .map(driver => toDriverStructure(driver, normalTimes,
      driver === selectedDriver || driver === selectedOpponent)).toArray();
}

export default plotStructure;
