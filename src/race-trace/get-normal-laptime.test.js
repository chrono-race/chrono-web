import chai, { assert, should } from 'chai';
import chaiStats from 'chai-stats';
import { fromJS } from 'immutable';
import getNormalLaptime from './get-normal-laptime';

chai.use(chaiStats);

should();

describe('get normal laptime', () => {
  it('finds the average laptime of the leader', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          cumulativeTime: [0, 91, 182],
        },
        ALO: {
          cumulativeTime: [1, 93, 185],
        },
      },
    });

    assert.almostEqual(getNormalLaptime(session), 60.6666, 3);
  });

  it('ignores NaNs', () => {
    const session = fromJS({
      drivers: {
        VAN: {
          cumulativeTime: [0, 91, 182],
        },
        ALO: {
          cumulativeTime: [1, 93, NaN],
        },
      },
    });

    assert.almostEqual(getNormalLaptime(session), 60.6666, 3);
  });
});
