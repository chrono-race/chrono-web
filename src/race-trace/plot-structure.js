
function toLapNumberPairs(driverTimes) {
  return driverTimes.map((value, index) => [index + 1, value]).toArray();
}

function toDriverStructure(driverName, driverInfo, normalTimes, highlight) {
  if (highlight) {
    return {
      label: `&nbsp;${driverName}`,
      color: driverInfo.get('color'),
      data: toLapNumberPairs(normalTimes.get(driverName)),
      lines: {
        lineWidth: 2,
      },
    };
  }
  return {
    color: driverInfo.get('color'),
    data: toLapNumberPairs(normalTimes.get(driverName)),
  };
}

function plotStructure(normalTimes, drivers, selectedDriver, selectedOpponent) {
  return normalTimes.keySeq()
    .map(driver => toDriverStructure(driver, drivers.get(driver), normalTimes,
      driver === selectedDriver || driver === selectedOpponent)).toArray();
}

export default plotStructure;
