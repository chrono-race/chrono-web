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
    const drivers = fromJS({
      VAN: {
        color: '#ff0000',
      },
      ALO: {
        color: '#00ff00',
      },
    });

    const expected = [
      {
        color: '#ff0000',
        data: [[1, 0], [2, 1], [3, 2]],
      },
      {
        color: '#00ff00',
        data: [[1, 1], [2, 3], [3, 5]],
      }];

    const result = plotStructure(normalTimes, drivers);

    assert(JSON.stringify(result).should.equal(JSON.stringify(expected)));
  });

  it('outputs selected driver thicker with label', () => {
    const normalTimes = fromJS({
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });

    const drivers = fromJS({
      VAN: {
        color: '#ff0000',
      },
      ALO: {
        color: '#00ff00',
      },
    });

    const expected = [
      {
        label: 'VAN',
        color: '#ff0000',
        data: [[1, 0], [2, 1], [3, 2]],
        lines: {
          lineWidth: 2,
        },
      },
      {
        color: '#00ff00',
        data: [[1, 1], [2, 3], [3, 5]],
      }];

    const result = plotStructure(normalTimes, drivers, 'VAN');

    assert(JSON.stringify(result).should.equal(JSON.stringify(expected)));
  });

  it('outputs selected opponent thicker with label', () => {
    const normalTimes = fromJS({
      VAN: [0, 1, 2],
      ALO: [1, 3, 5],
    });

    const drivers = fromJS({
      VAN: {
        color: '#ff0000',
      },
      ALO: {
        color: '#00ff00',
      },
    });

    const expected = [
      {
        label: 'VAN',
        color: '#ff0000',
        data: [[1, 0], [2, 1], [3, 2]],
        lines: {
          lineWidth: 2,
        },
      },
      {
        color: '#00ff00',
        data: [[1, 1], [2, 3], [3, 5]],
      }];

    const result = plotStructure(normalTimes, drivers, '', 'VAN');

    assert(JSON.stringify(result).should.equal(JSON.stringify(expected)));
  });
});
