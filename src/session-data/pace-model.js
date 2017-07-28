import { fromJS } from 'immutable';
import math from 'mathjs';

function toHeaderArray(referenceTyre, tyres, drivers) {
  const r = [];
  r.push('raceLapIndex');
  tyres.forEach(tyre => r.push(`${tyre} stint lap`));
  tyres.forEach((tyre) => {
    if (tyre !== referenceTyre) {
      r.push(`${tyre} delta vs ${referenceTyre}`);
    }
  });
  drivers.forEach(d => r.push(`${d} pace`));
  r.push('lap time');
  return r;
}

// row of:
//   raceLapIndex
//   if S, stintLapIndex, 0 o/w
//   if M, stintLapIndex, 0 o/w
//   ...
//   for each non-reference tyre, 1 or 0
//   if driver1: 1, 0 o/w
//   if driver2: 1, 0 o/w
//   ...
function toCsvArrayLap(lap, driver, referenceTyre, tyres, drivers) {
  const r = [];
  r.push(lap.raceLapIndex);
  tyres.forEach((tyre) => {
    if (lap.tyre === tyre) {
      r.push(lap.stintLapIndex);
    } else {
      r.push(0);
    }
  });
  tyres.forEach((tyre) => {
    if (tyre !== referenceTyre) {
      if (lap.tyre === tyre) {
        r.push(1);
      } else {
        r.push(0);
      }
    }
  });
  drivers.forEach((d) => {
    if (driver === d) {
      r.push(1);
    } else {
      r.push(0);
    }
  });
  r.push(lap.lapTime);
  return r;
}

function toCsvArray(laps, driver, referenceTyre, tyres, drivers) {
  if (laps === undefined) {
    return [];
  }
  return laps.map(lap => toCsvArrayLap(lap, driver, referenceTyre, tyres, drivers));
}

function getModelLaps(freeAirLaps, tyres, driverList) {
  const rows = [];
  driverList.forEach((tla) => {
    toCsvArray(freeAirLaps.get(tla), tla, tyres[0], tyres, driverList).forEach(x => rows.push(x));
  });
  return rows;
}
function dumpCsv(freeAirLaps, tyres, driverList) {
  const headerRow = toHeaderArray(tyres[0], tyres, driverList);
  const rows = [headerRow, ...getModelLaps(freeAirLaps, tyres, driverList)];

  console.log(`read:\n${rows.join('\n')}`);
}

function calcModel(drivers, freeAirLaps) {
  if (freeAirLaps.size === 0) {
    return {};
  }

  const foundTyres = [...new Set(freeAirLaps.toList().flatMap(laps => fromJS(laps).map(lap => lap.get('tyre'))))];
  const interestingTyres = ['E', 'V', 'S', 'M', 'H'];
  const tyres = interestingTyres.filter(t => foundTyres.includes(t));

  // get drivers for whom we have free air laps
  const driverList = freeAirLaps
    .filter(laps => laps.length > 1)
    .map((laps, driver) => driver).toArray();

  // dumpCsv(freeAirLaps, tyres, driverList);

  const modelLaps = math.matrix(getModelLaps(freeAirLaps, tyres, driverList));

  const numDrivers = driverList.length;
  const numLaps = math.subset(math.size(modelLaps), math.index(0));
  const numCols = math.subset(math.size(modelLaps), math.index(1));
  const numTyres = (numCols - numDrivers - 1) / 2;

  const X = math.subset(modelLaps, math.index(math.range(0, numLaps), math.range(0, numCols - 1)));
  const y = math.subset(modelLaps, math.index(math.range(0, numLaps), math.range(numCols - 1, numCols)));
  const lambda = 0.01;

  let reg = math.zeros(numCols - 1, numCols - 1);
  // we want to regularize the tyre delta column(s)
  // for 2 tyres column indices 3->3
  // for 3 tyres column indices 4->5
  // for 4 tyres column indices 5->7
  for (let i = numTyres+1; i <= (2*numTyres) - 1; i++) { // eslint-disable-line
    reg = math.subset(reg, math.index(i, i), 1);
  }

  // theta = inv((X' * X) + (lambda * reg)) * X' * y
  let theta;
  try {
    theta = math.multiply(math.multiply(
                math.inv(
                  math.add(
                    math.multiply(math.transpose(X), X),
                    math.multiply(lambda, reg))),
                math.transpose(X)),
            y);
  } catch (e) {
    console.log(`error: ${e}`);
    return {};
  }

  const model = {
    fuelEffect: math.subset(theta, math.index(0, 0)),
    tyreModel: {
      deg: {},
      baseTyre: tyres[0],
      delta: {},
    },
    driverModel: {},
  };

  tyres.forEach((tyre, index) => {
    model.tyreModel.deg[tyre] = math.subset(theta, math.index(1 + index, 0));
    if (index > 0) {
      model.tyreModel.delta[tyre] = math.subset(theta, math.index(tyres.length + index, 0));
    }
  });

  driverList.forEach((driver, index) => {
    model.driverModel[driver] = math.subset(theta, math.index((tyres.length * 2) + index, 0));
  });

  console.log(`got model: ${JSON.stringify(model)}`);

  return model;
}

export default calcModel;
