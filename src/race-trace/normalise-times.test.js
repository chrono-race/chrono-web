import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import findSlowLapNumbers from './find-slow-laps';
import normaliseTimes from './normalise-times';

should();

describe('normalise times', () => {
  it('outputs times reduced by leader\'s average lap', () => {
    const times = fromJS({
      VAN: [0, 91, 182],
      ALO: [1, 93, 185],
    });
    const expectedTimes = fromJS({
      VAN: [0, 0, 0],
      ALO: [1, 2, 3],
    });

    const normalTimes = normaliseTimes(times, []);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('ignores NaN laptimes', () => {
    const times = fromJS({
      VAN: [0, 91, 182, NaN],
      ALO: [1, 93, 185, NaN],
    });
    const expectedTimes = fromJS({
      VAN: [0, 0, 0, NaN],
      ALO: [1, 2, 3, NaN],
    });

    const normalTimes = normaliseTimes(times, []);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('offsets slow laps', () => {
    const times = fromJS({
      VAN: [0, 180, 270],
      ALO: [1, 182, 273],
    });
    const expectedTimes = fromJS({
      VAN: [0, 0, 0],
      ALO: [1, 2, 3],
    });

    const slowLapNumbers = findSlowLapNumbers(times);
    const normalTimes = normaliseTimes(times, slowLapNumbers);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('offsets multiple slow laps before normalising times', () => {
    const times = fromJS({
      VAN:
        // slow laps:                      x    x    x
        // lap times:             90, 100, 110, 140, 140, 90, 90, 90
        // with slow laps fixed:  90, 100,  92,  92,  92, 90, 90, 90
        // typical lap: 92
        // delta to typical:       -2,  8,   0,   0,   0, -2, -2, -2
        [0, 90, 190, 300, 440, 580, 670, 760, 850],
    });

    const expectedTimes = fromJS({
      VAN: [0, -2, 6, 6, 6, 6, 4, 2, 0],
    });

    const slowLapNumbers = findSlowLapNumbers(times);
    const normalTimes = normaliseTimes(times, slowLapNumbers);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });
});
