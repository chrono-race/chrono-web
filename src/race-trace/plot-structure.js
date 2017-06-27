
function toLapNumberPairs(driverTimes) {
  return driverTimes.map((value, index) => [index + 1, value]).toArray();
}

function plotStructure(normalTimes) {
  return normalTimes.keySeq().map(driver => ({
    data: toLapNumberPairs(normalTimes.get(driver)),
  })).toArray();
}

export default plotStructure;
