import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import leaderOnLap from './leader-on-lap';

should();

describe('leader on lap', () => {
  it('finds leader on lap', () => {
    const times = fromJS({
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });

    assert(leaderOnLap(times, 1).should.equal('VAN'));
  });
});
