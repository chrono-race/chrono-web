import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import offsetSlowLaps from './offset-slow-laps';

should();

describe('offset slow laps', () => {
  it('does nothing if no slow laps', () => {
    const times = fromJS({
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });
    const best = 90;

    assert(JSON.stringify(offsetSlowLaps(times, best)).should.equal(JSON.stringify(times)));
  });

  it('offsets slow laps', () => {
    const inputTimes = fromJS({
      VAN: [0, 91, 92],
      ALO: [1, 93, 95],
    });
    const normalLap = 90;

    const expectedTimes = fromJS({
      VAN: [0, 0, 1],
      ALO: [1, 2, 4],
    });

    assert(JSON.stringify(offsetSlowLaps(inputTimes, normalLap))
      .should.equal(JSON.stringify(expectedTimes)));
  });
});
