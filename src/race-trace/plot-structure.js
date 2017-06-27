
function toLapNumberPairs(driverTimes) {
  return driverTimes.map((value, index) => [index + 1, value]);
}

function plotStructure(normalTimes) {
  return normalTimes.keySeq().map(driver => ({
    data: toLapNumberPairs(normalTimes.get(driver)),
  }));
}

export default plotStructure;
