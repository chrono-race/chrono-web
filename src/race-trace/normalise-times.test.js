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
          cumulativeTime: [0, 80, 190, 330, 410],
        },
      },
    });

    const expectedTimes = fromJS({
      VAN: [0, -10, 10, 10, 0],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });

  it('offsets multiple slow laps before normalising times', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          cumulativeTime: [0, 80, 190, 330, 470, 550],
        },
      },
    });

    // these times aren't ideal but are correct for current algorithm
    // would be better if lap 4 and 5 both showed zero change but
    // needs a more complex algorithm
    const expectedTimes = fromJS({
      VAN: [0, -13.125, 3.75, 13.125, 13.125, 0],
    });

    const normalTimes = normaliseTimes(session);

    assert(JSON.stringify(normalTimes).should.equal(JSON.stringify(expectedTimes)));
  });
});
