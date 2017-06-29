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

  it('outputs selected driver thicker with label', () => {
    const normalTimes = fromJS({
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });

    const expected = [
      {
        label: 'VAN',
        data: [[1, 0], [2, 1], [3, 2]],
        lines: {
          lineWidth: 2,
        },
      },
      {
        data: [[1, 1], [2, 3], [3, 5]],
      }];

    const result = plotStructure(normalTimes, 'VAN');

    assert(JSON.stringify(result).should.equal(JSON.stringify(expected)));
  });

  it('outputs selected opponent thicker with label', () => {
    const normalTimes = fromJS({
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });

    const expected = [
      {
        label: 'VAN',
        data: [[1, 0], [2, 1], [3, 2]],
        lines: {
          lineWidth: 2,
        },
      },
      {
        data: [[1, 1], [2, 3], [3, 5]],
      }];

    const result = plotStructure(normalTimes, '', 'VAN');

    assert(JSON.stringify(result).should.equal(JSON.stringify(expected)));
  });
});
