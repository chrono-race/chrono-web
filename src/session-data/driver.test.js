import { assert, should } from 'chai';
import { newDriver, appendMessage, findBests } from './driver';

should();

describe('driver', () => {
  it('newDriver is created with no laps, no bests, empty current status and no stints', () => {
    const d = newDriver();
    assert(d.get('laps').isEmpty().should.equal(true));
    assert(d.get('best').get('s1Time').should.be.NaN);
    assert(d.get('best').get('s2Time').should.be.NaN);
    assert(d.get('best').get('s3Time').should.be.NaN);
    assert(d.get('best').get('lapTime').should.be.NaN);
    assert(d.get('currentStatus').should.equal(''));
    assert(d.get('stints').count().should.equal(0));
  });

  describe('append message', () => {
    it('adds first empty lap', () => {
      const d = appendMessage(newDriver(), { driver: 'VAN', lapNumber: 1, lapTime: 90.123 });

      assert(d.get('laps').count().should.equal(1));
      assert(d.get('laps').get(0).get('lapNumber').should.equal(1));
      assert(d.get('laps').get(0).get('lapTime').should.equal(90.123));
    });

    it('adds missing laps', () => {
      let d = newDriver();
      d = appendMessage(d, { driver: 'VAN', lapNumber: 1, lapTime: 90.123 });

      d = appendMessage(d, { driver: 'VAN', lapNumber: 4, lapTime: 93.333 });

      assert(d.get('laps').count().should.equal(4));
      assert(d.get('laps').get(1).get('lapNumber').should.equal(2));
      assert(d.get('laps').get(1).get('lapTime').should.be.NaN);
      assert(d.get('laps').get(2).get('lapNumber').should.equal(3));
      assert(d.get('laps').get(2).get('lapTime').should.be.NaN);
      assert(d.get('laps').get(3).get('lapNumber').should.equal(4));
      assert(d.get('laps').get(3).get('lapTime').should.equal(93.333));
    });

    it('preserves existing bests', () => {
      const d = appendMessage(newDriver(), { driver: 'VAN', lapNumber: 1, lapTime: 90.123 });

      assert(d.get('laps').count().should.equal(1));
      assert(d.get('best').get('s1Time').should.be.NaN);
    });

    it('preserves existing status & stints on receipt of lap message', () => {
      const d = appendMessage(newDriver(), { driver: 'VAN', lapNumber: 1, lapTime: 90.123 });

      assert(d.get('laps').count().should.equal(1));
      assert(d.get('currentStatus').should.equal(''));
      assert(d.get('stints').count().should.equal(0));
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

    it('preserves laps', () => {
      const msg = { driver: 'VAN', lapNumber: 1, lapTime: 90.123 };
      const d = findBests(appendMessage(newDriver(), msg));

      assert(d.get('laps').count().should.equal(1));
    });

    it('is the best for a driver with laps', () => {
      const msg1 = { lapNumber: 1,
        s1Time: 31.111,
        s2Time: 32.222,
        s3Time: 33.333,
        lapTime: 94.111 };
      const msg2 = { lapNumber: 2,
        s1Time: 31.222,
        s2Time: 32.020,
        s3Time: 33.999,
        lapTime: 94.444 };
      const d = findBests(appendMessage(appendMessage(newDriver(), msg1), msg2));

      assert(d.get('best').get('s1Time').should.equal(31.111));
      assert(d.get('best').get('s2Time').should.equal(32.020));
      assert(d.get('best').get('s3Time').should.equal(33.333));
      assert(d.get('best').get('lapTime').should.equal(94.111));
    });

    it('ignores NaN values in finding best', () => {
      const msg1 = { lapNumber: 1,
        s1Time: NaN,
        s2Time: 32.222,
        s3Time: 33.333,
        lapTime: NaN };
      const msg2 = { lapNumber: 2,
        s1Time: 31.222,
        s2Time: 32.020,
        s3Time: 33.999,
        lapTime: 94.444 };
      const d = findBests(appendMessage(appendMessage(newDriver(), msg1), msg2));

      assert(d.get('best').get('s1Time').should.equal(31.222));
      assert(d.get('best').get('s2Time').should.equal(32.020));
      assert(d.get('best').get('s3Time').should.equal(33.333));
      assert(d.get('best').get('lapTime').should.equal(94.444));
    });

    it('ignores null values in finding best', () => {
      const msg1 = { lapNumber: 1,
        s1Time: null,
        s2Time: 32.222,
        s3Time: 33.333,
        lapTime: null };
      const msg2 = { lapNumber: 2,
        s1Time: 31.222,
        s2Time: 32.020,
        s3Time: 33.999,
        lapTime: 94.444 };
      const d = findBests(appendMessage(appendMessage(newDriver(), msg1), msg2));

      assert(d.get('best').get('s1Time').should.equal(31.222));
      assert(d.get('best').get('s2Time').should.equal(32.020));
      assert(d.get('best').get('s3Time').should.equal(33.333));
      assert(d.get('best').get('lapTime').should.equal(94.444));
    });
  });
});
