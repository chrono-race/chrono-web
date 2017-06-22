import { assert, should } from 'chai';
import { toSectorTime, toGapTime } from '../session-data/timing-utils';

should();

describe('timing utils', () => {
  it('returns empty string for null input', () => {
    const gap = toSectorTime(null);

    assert(gap.should.be.empty);
  });

  it('returns empty string for negative input', () => {
    const gap = toSectorTime(-2);

    assert(gap.should.be.empty);
  });

  it('returns sector time in correct format', () => {
    const gap = toSectorTime(23.9);
    assert(gap.should.equal('23.900'));
  });

  it('returns gap in sector format', () => {
    const gap = toGapTime(2.3);

    assert(gap.should.equal('2.300'));
  });

  it('returns number of laps down', () => {
    const gap = toGapTime(-2);

    assert(gap.should.equal('2L'));
  });
});

