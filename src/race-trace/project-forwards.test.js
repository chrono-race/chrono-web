import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import projectForwards from './project-forwards';

should();

describe('project forwards', () => {
  it('does nothing for empty times', () => {
    const inputTimes = fromJS({});
    const expectedResult = fromJS({});
    const drivers = fromJS({});

    const result = projectForwards(inputTimes, drivers, 1, {}, {});

    assert(JSON.stringify(result).should.equal(JSON.stringify(expectedResult)));
  });

  it('projects drivers times forwards', () => {
    const inputTimes = fromJS({
      ALO: [0, 90, 180, NaN],
      BUT: [0, 100, 200, 300],
    });

    const expectedResult = fromJS({
      ALO: [0, 90, 180, 270, 360, 450],
      BUT: [0, 100, 200, 300, 400, 500],
    });

    const drivers = fromJS({
      ALO: { stints: [] },
      BUT: { stints: [] },
    });

    const result = projectForwards(inputTimes, drivers, 2, {}, {});

    assert(JSON.stringify(result).should.equal(JSON.stringify(expectedResult)));
  });

  it('does nothing for drivers with no laps', () => {
    const inputTimes = fromJS({
      ALO: [0, 90, 180, NaN],
      BUT: [0, 100, 200, 300],
      VER: [],
    });

    const expectedResult = fromJS({
      ALO: [0, 90, 180, 270, 360, 450],
      BUT: [0, 100, 200, 300, 400, 500],
      VER: [],
    });

    const drivers = fromJS({
      ALO: { stints: [] },
      BUT: { stints: [] },
    });

    const result = projectForwards(inputTimes, drivers, 2, {}, {});

    assert(JSON.stringify(result).should.equal(JSON.stringify(expectedResult)));
  });

  it('does nothing for drivers with one lap', () => {
    const inputTimes = fromJS({
      ALO: [0, 90, 180, 270],
      BUT: [0, 100, 200, NaN],
      VER: [0, NaN],
    });

    const expectedResult = fromJS({
      ALO: [0, 90, 180, 270, 360, 450],
      BUT: [0, 100, 200, 300, 400, 500],
      VER: [0, NaN],
    });

    const drivers = fromJS({
      ALO: { stints: [] },
      BUT: { stints: [] },
    });

    const result = projectForwards(inputTimes, drivers, 2, {}, {});

    assert(JSON.stringify(result).should.equal(JSON.stringify(expectedResult)));
  });

  it('excludes in/out laps', () => {
    const inputTimes = fromJS({
      ALO: [0, 90, 240, 390, 480],
    });

    const expectedResult = fromJS({
      ALO: [0, 90, 240, 390, 480, 570, 660],
    });

    const drivers = fromJS({
      ALO: {
        stints: [
          { startLap: 4 },
        ],
      },
    });

    const result = projectForwards(inputTimes, drivers, 2, {}, {});

    assert(JSON.stringify(result).should.equal(JSON.stringify(expectedResult)));
  });

  it('adds pit stops', () => {
    const inputTimes = fromJS({
      ALO: [0, 90, 180, 270],
      BUT: [0, 100, 200, NaN],
    });

    const expectedResult = fromJS({
      ALO: [0, 90, 180, 270, 360, 470, 560, 650, 740],
      BUT: [0, 100, 200, 300, 400, 500, 620, 720, 820],
    });

    const drivers = fromJS({
      ALO: { stints: [] },
      BUT: { stints: [] },
    });

    const pitStops = {
      ALO: 2,
      BUT: 4,
    };
    const pitModelParams = {
      timeLostInPits: 20,
    };

    const result = projectForwards(inputTimes, drivers, 5, pitStops, pitModelParams);

    assert(JSON.stringify(result).should.equal(JSON.stringify(expectedResult)));
  });
});
