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

  it('offsets slow laps before normalising times', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          cumulativeTime: [0, 90, 200, 290, 430, 520],
        },
      },
    });

    const expectedTimes = fromJS({
      VAN: [0, -5, 10, 5, 5, 0],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('offsets multiple slow laps before normalising times', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          // lap times:            90, 110, 140, 140, 90, 90, 90
          // with slow laps fixed: 90, 110,  94,  94, 90, 90, 90
          // typical lap: 94
          // delta to typical:     -4, +16,   0,   0, -4, -4, -4
          cumulativeTime: [0, 90, 200, 340, 480, 570, 660, 750],
        },
      },
    });

    const expectedTimes = fromJS({
      VAN: [0, -4, 12, 12, 12, 8, 4, 0],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });
});
