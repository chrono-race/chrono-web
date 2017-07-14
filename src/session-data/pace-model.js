import { fromJS } from 'immutable';
import math from 'mathjs';

function median(values) {
  if (values.length === 0) {
    return undefined;
  }
  if (values.length % 2 === 1) {
    return values[(values.length - 1) / 2];
  }
  return (values[values.length / 2] + values[(values.length / 2) - 1]) / 2;
}

function forTyre(lap, tyre, value) {
  if (lap.tyre === tyre) {
    return value;
  }
  return 0;
}

// create matrix with
//   raceLapIndex
//   1 if tyre == 'S', 0 o/w
//   stintLapIndex if tyre == 'S', 0 o/w
//   1 if tyre == 'M', 0 o/w
//   stintLapIndex if tyre == 'M', 0 o/w
//   ...etc... for each usableTyre
function prepareMatrixRow(lap, usableTyres) {
  const row = [lap.raceLapIndex];
  usableTyres.forEach((tyre) => {
    row.push(forTyre(lap, tyre, 1));
    row.push(forTyre(lap, tyre, lap.stintLapIndex));
  });
  return row;
}

// translates the theta from the above matrix row to a result structure
function fromVectorToResult(theta, usableTyres) {
  const result = {
    fuelEffect: theta.subset(math.index(0, 0)),
    tyreModel: {},
  };
  let index = 1;
  usableTyres.forEach((tyre) => {
    result.tyreModel[tyre] = {
      offset: theta.subset(math.index(index++, 0)),  // eslint-disable-line
      gain: theta.subset(math.index(index++, 0)),   // eslint-disable-line
    };
  });
  return result;
}

function findParams(freeAirLaps) {
  const lapsByTyre = fromJS(freeAirLaps.map(lap => lap.tyre)).groupBy(tyre => tyre);
  const usableTyres = lapsByTyre.keySeq().filter(tyre => lapsByTyre.get(tyre).count() >= 5);
  const usableLaps = freeAirLaps.filter(lap => usableTyres.contains(lap.tyre));

  if (usableLaps.length === 0) {
    return {};
  }

  const X = math.matrix(usableLaps.map(lap => prepareMatrixRow(lap, usableTyres)));
  const y = math.transpose(math.matrix([usableLaps.map(lap => lap.lapTime)]));

  // theta = inv(X' * X) * X' * y
  let theta;
  try {
    theta = math.multiply(math.multiply(math.inv(math.multiply(math.transpose(X), X)),
                                        math.transpose(X)), y);
  } catch (e) {
    return {};
  }

  const hyp = math.multiply(X, theta);

  const meanSquaredError = math.sum(math.square(math.subtract(hyp, y))) /
                              math.size(y).subset(math.index(0));

  return Object.assign(fromVectorToResult(theta, usableTyres), { meanSquaredError });
}

function findMedianTyreDeg(usableParams, tyre) {
  return median(usableParams
              .filter(p => p !== undefined &&
                           p.tyreModel[tyre] !== undefined &&
                           !isNaN(p.tyreModel[tyre].gain))
              .map(p => p.tyreModel[tyre].gain)
              .sort().toArray());
}

const concat = (x, y) => x.concat(y);
const flatmap = (xs, f) => xs.map(f).reduce(concat, []);

function calcModel(drivers, freeAirLaps) {
  const allParams = freeAirLaps.map((lap, driver) => findParams(lap, driver));

  const usableParams = allParams.filter(p => p.meanSquaredError < 0.5);

  const fuelGains = usableParams
                .filter(p => p !== undefined && !isNaN(p.fuelEffect))
                .map(p => p.fuelEffect)
                .sort();

  const model = {
    fuelEffect: median(fuelGains.toArray()),
    tyreModel: { },
    drivers: {},
  };

  const allTyres = [...new Set(flatmap(usableParams, p => Object.keys(p.tyreModel)))];
  allTyres.forEach((tyre) => {
    model.tyreModel[tyre] = findMedianTyreDeg(usableParams, tyre);
  });

  drivers.forEach((driver) => {
    model.drivers[driver.get('tla')] = usableParams.get(driver.get('tla'));
  });

  console.log(`model is ${JSON.stringify(model)}`);

  return model;
}

export default calcModel;
