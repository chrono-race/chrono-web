import { assert, should } from 'chai';
import { newDriver, appendMessage, findBests } from './driver';

should();

describe('driver', () => {
  it('newDriver is created with no laps and no bests', () => {
    const d = newDriver();
    assert(d.get('laps').isEmpty().should.equal(true));
    assert(d.get('best').get('s1Time').should.be.NaN);
    assert(d.get('best').get('s2Time').should.be.NaN);
    assert(d.get('best').get('s3Time').should.be.NaN);
    assert(d.get('best').get('lapTime').should.be.NaN);
  });

  describe('append message', () => {
    it('adds first empty lap', () => {
      const d = appendMessage(newDriver(), {driver: 'VAN', lapNumber: 1, lapTime: 90.123});

      assert(d.get('laps').count().should.equal(1));
      assert(d.get('laps').get(0).get('lapNumber').should.equal(1));
      assert(d.get('laps').get(0).get('lapTime').should.equal(90.123));
    });

    it('adds missing laps', () => {
      let d = newDriver();
      d = appendMessage(d, {driver: 'VAN', lapNumber: 1, lapTime: 90.123});

      d = appendMessage(d, {driver: 'VAN', lapNumber: 4, lapTime: 93.333});

      assert(d.get('laps').count().should.equal(4));
      assert(d.get('laps').get(1).get('lapNumber').should.equal(2));
      assert(d.get('laps').get(1).get('lapTime').should.be.NaN);
      assert(d.get('laps').get(2).get('lapNumber').should.equal(3));
      assert(d.get('laps').get(2).get('lapTime').should.be.NaN);
      assert(d.get('laps').get(3).get('lapNumber').should.equal(4));
      assert(d.get('laps').get(3).get('lapTime').should.equal(93.333));
    });
  });

  describe('find bests', () => {
    it('is NaN for an empty driver', () => {
      const d = findBests(newDriver());

      assert(d.get('best').get('s1Time').should.be.NaN);
      assert(d.get('best').get('s2Time').should.be.NaN);
      assert(d.get('best').get('s3Time').should.be.NaN);
      assert(d.get('best').get('lapTime').should.be.NaN);
    });

    it('is the best for a driver with laps', () => {
      const msg1 = {lapNumber:1, s1Time: 31.111, s2Time: 32.222, s3Time: 33.333, lapTime: 94.111}
      const msg2 = {lapNumber:2, s1Time: 31.222, s2Time: 32.020, s3Time: 33.999, lapTime: 94.444}
      const d = findBests(appendMessage(appendMessage(newDriver(), msg1), msg2));

      assert(d.get('best').get('s1Time').should.equal(31.111));
      assert(d.get('best').get('s2Time').should.equal(32.020));
      assert(d.get('best').get('s3Time').should.equal(33.333));
      assert(d.get('best').get('lapTime').should.equal(94.111));
    });
  });
});