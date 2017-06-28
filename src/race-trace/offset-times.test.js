import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import offsetTimes from './offset-times';

should();

describe('offset times', () => {
  it('reduces lap times from given point onwards', () => {
    const inputTimes = fromJS({
      VAN: [0, 91, 92],
      ALO: [1, 93, 95],
    });
    const fromTime = 91;
    const offset = 90;

    const expectedResult = fromJS({
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });

    const result = offsetTimes(inputTimes, fromTime, offset);

    assert(JSON.stringify(result).should.equal(JSON.stringify(expectedResult)));
  });
});
