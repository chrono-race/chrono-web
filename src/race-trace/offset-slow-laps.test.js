import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import offsetSlowLaps from './offset-slow-laps';

should();

describe('offset slow laps', () => {
  it('does nothing if no slow laps', () => {
    const times = fromJS({
      VAN: [0, 91, 182],
      ALO: [1, 93, 185],
    });
    const best = 90;

    assert(JSON.stringify(offsetSlowLaps(times, best)).should.equal(JSON.stringify(times)));
  });

  it('offsets single slow lap for one driver', () => {
    const inputTimes = fromJS({
      VAN: [0, 90, 230, 320],
    });

    const expectedTimes = fromJS({
      VAN: [0, 90, 180, 270],
    });

    assert(JSON.stringify(offsetSlowLaps(inputTimes))
      .should.equal(JSON.stringify(expectedTimes)));
  });

  it('offsets multiple slow laps for one driver', () => {
    const inputTimes = fromJS({
      VAN: [0, 90, 230, 370, 460],
    });

    // a better algorithm would lead to non-recurring decimals here
    // but these values are correct for the current implementation
    const expectedTimes = fromJS({
      VAN: [0, 90, 196.66666666666669, 292.22222222222223, 382.22222222222223],
    });

    assert(JSON.stringify(offsetSlowLaps(inputTimes))
      .should.equal(JSON.stringify(expectedTimes)));
  });
});
