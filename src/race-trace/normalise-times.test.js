import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import normaliseTimes from './normalise-times';

should();

describe('normalise times', () => {
  it('outputs times reduced by leader\'s average lap', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          cumulativeTime: [0, 91, 182],
        },
        ALO: {
          cumulativeTime: [1, 93, 185],
        },
      },
      best: {
        lapTime: 90,
      },
    });
    const expectedTimes = fromJS({
      VAN: [0, 0, 0],
      ALO: [1, 2, 3],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('ignores NaN laptimes', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          cumulativeTime: [0, 91, 182, NaN],
        },
        ALO: {
          cumulativeTime: [1, 93, 185, NaN],
        },
      },
      best: {
        lapTime: 90,
      },
    });
    const expectedTimes = fromJS({
      VAN: [0, 0, 0, NaN],
      ALO: [1, 2, 3, NaN],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('offsets slow laps', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          cumulativeTime: [0, 180, 270],
        },
        ALO: {
          cumulativeTime: [1, 182, 273],
        },
      },
    });
    const expectedTimes = fromJS({
      VAN: [0, 0, 0],
      ALO: [1, 2, 3],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('offsets multiple slow laps before normalising times', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          // slow laps:                      x    x    x
          // lap times:             90, 100, 110, 140, 140, 90, 90, 90
          // with slow laps fixed:  90, 100,  92,  92,  92, 90, 90, 90
          // typical lap: 92
          // delta to typical:       -2,  8,   0,   0,   0, -2, -2, -2
          cumulativeTime: [0, 90, 190, 300, 440, 580, 670, 760, 850],
        },
      },
    });

    const expectedTimes = fromJS({
      VAN: [0, -2, 6, 6, 6, 6, 4, 2, 0],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });
});
