import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import getNormalLaptime from './get-normal-laptime';

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

    assert(getNormalLaptime(session).should.equal(91));
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

    assert(getNormalLaptime(session).should.equal(91));
  });
});
