import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import plotStructure from './plot-structure';

should();

describe('plot structure', () => {
  it('outputs plot structure from normalised time structure', () => {
    const normalTimes = fromJS({
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });

    const expected = [
      {
        data: [[1, 0], [2, 1], [3, 2]],
      },
      {
        data: [[1, 1], [2, 3], [3, 5]],
      }];

    const result = plotStructure(normalTimes);

    assert(JSON.stringify(result).should.equal(JSON.stringify(expected)));
  });
});
