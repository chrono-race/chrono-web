import { assert, should } from 'chai';
import median from './median';

should();

describe('median', () => {
  it('is undefined for empty list', () => {
    assert.isUndefined(median([]));
  });

  it('is middle value with odd number of values', () => {
    assert(median([1, 5, 7]).should.equal(5));
  });

  it('is average of two middle values with even number of values', () => {
    assert(median([1, 5, 6, 9]).should.equal(5.5));
  });
});
