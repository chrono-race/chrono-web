import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import getDelta from './getDelta';

should();

describe('getDelta', () => {
  it('returns empty if driver missing', () => {
    const result = getDelta(undefined, undefined, 1);

    assert(result.should.equal(''));
  });

  it('returns empty if opponent missing', () => {
    const driver = fromJS({
      cumuatliveTime: [0, 5],
    });
    const result = getDelta(driver, undefined, 1);

    assert(result.should.equal(''));
  });

  it('returns gap between driver and opponent for a given lap', () => {
    const driver = fromJS({
      cumulativeTime: [0, 5, 15],
    });
    const opponent = fromJS({
      cumulativeTime: [0, 6, 17],
    });
    const result = getDelta(driver, opponent, 3);

    assert(result.should.equal('-2.000'));
  });

  it('returns empty if driver has not completed lap', () => {
    const driver = fromJS({
      cumulativeTime: [0, 5],
    });
    const opponent = fromJS({
      cumulativeTime: [0, 6, 17],
    });
    const result = getDelta(driver, opponent, 3);

    assert(result.should.equal(''));
  });

  it('returns empty if opponent has not completed lap', () => {
    const driver = fromJS({
      cumulativeTime: [0, 5, 15],
    });
    const opponent = fromJS({
      cumulativeTime: [0, 6],
    });
    const result = getDelta(driver, opponent, 3);

    assert(result.should.equal(''));
  });

  it('returns empty if driver has no laptime for selected lap', () => {
    const driver = fromJS({
      cumulativeTime: [0, 5, NaN],
    });
    const opponent = fromJS({
      cumulativeTime: [0, 6, 17],
    });
    const result = getDelta(driver, opponent, 3);

    assert(result.should.equal(''));
  });

  it('returns empty if opponent has no laptime for selected lap', () => {
    const driver = fromJS({
      cumulativeTime: [0, 5, 15],
    });
    const opponent = fromJS({
      cumulativeTime: [0, 6, NaN],
    });
    const result = getDelta(driver, opponent, 3);

    assert(result.should.equal(''));
  });
});
