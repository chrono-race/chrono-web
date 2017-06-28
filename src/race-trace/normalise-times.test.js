import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import normaliseTimes from './normalise-times';

should();

describe('normalise times', () => {
  it('outputs times reduced by fastest lap', () => {
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
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('offsets slow laps', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          cumulativeTime: [0, 180, 271],
        },
        ALO: {
          cumulativeTime: [1, 182, 274],
        },
      },
      best: {
        lapTime: 90,
      },
    });
    const expectedTimes = fromJS({
      VAN: [0, 0, 1],
      ALO: [1, 2, 4],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });
});
