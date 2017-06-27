import chai, { assert, should } from 'chai';
import chaiStats from 'chai-stats';
import { newDriver, appendMessage, findBests } from './driver';

chai.use(chaiStats);

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
    assert(d.get('cumulativeTime').count().should.equal(0));
  });

  describe('append message', () => {
    it('adds first empty lap', () => {
      const d = appendMessage(newDriver(), { type: 'lap', driver: 'VAN', lapNumber: 1, s2Time: 90.123 });

      assert(d.get('laps').count().should.equal(1));
      assert(d.get('laps').get(0).get('lapNumber').should.equal(1));
      assert(d.get('laps').get(0).get('s2Time').should.equal(90.123));
    });

    it('adds missing laps', () => {
      let d = newDriver();
      d = appendMessage(d, { type: 'lap', driver: 'VAN', lapNumber: 1, lapTime: 90.123 });

      d = appendMessage(d, { type: 'lap', driver: 'VAN', lapNumber: 4, lapTime: 93.333 });

      assert(d.get('laps').count().should.equal(4));
      assert(d.get('laps').get(1).get('lapNumber').should.equal(2));
      assert(d.get('laps').get(1).get('lapTime').should.be.NaN);
      assert(d.get('laps').get(2).get('lapNumber').should.equal(3));
      assert(d.get('laps').get(2).get('lapTime').should.be.NaN);
      assert(d.get('laps').get(3).get('lapNumber').should.equal(4));
      assert(d.get('laps').get(3).get('lapTime').should.equal(93.333));
    });

    it('preserves existing bests', () => {
      const d = appendMessage(newDriver(), { type: 'lap', driver: 'VAN', lapNumber: 1, lapTime: 90.123 });

      assert(d.get('laps').count().should.equal(1));
      assert(d.get('best').get('s1Time').should.be.NaN);
    });

    it('preserves existing status & stints on receipt of lap message', () => {
      const d = appendMessage(newDriver(), { type: 'lap', driver: 'VAN', lapNumber: 1, lapTime: 90.123 });

      assert(d.get('laps').count().should.equal(1));
      assert(d.get('currentStatus').should.equal(''));
      assert(d.get('stints').count().should.equal(0));
    });

    it('updates current status and stints on pit message', () => {
      const d = appendMessage(newDriver(), { type: 'pit',
        driver: 'VAN',
        currentStatus: 'in pit',
        stints: [
        { startLap: 0, tyre: 'M' },
        ] });

      assert(d.get('currentStatus').should.equal('in pit'));
      assert(d.get('stints').count().should.equal(1));
      assert(d.get('stints').get(0).get('tyre').should.equal('M'));
    });

    it('sets cumulative time for first lap to gap to leader', () => {
      const d = appendMessage(newDriver(), { type: 'lap', driver: 'VAN', lapNumber: 1, s2Time: 90.123, gap: 12.34 });

      assert(d.get('cumulativeTime').count().should.equal(1));
      assert(d.get('cumulativeTime').get(0).should.equal(12.34));
    });

    it('sets cumulative time for first lap to 0 for leader', () => {
      const d = appendMessage(newDriver(), { type: 'lap', driver: 'VAN', lapNumber: 1, s2Time: 90.123, gap: NaN });

      assert(d.get('cumulativeTime').count().should.equal(1));
      assert(d.get('cumulativeTime').get(0).should.equal(0));
    });

    it('sets cumulative time for second lap to gap to first lap gap + second lap time', () => {
      const lap1 = { type: 'lap', driver: 'VAN', lapNumber: 1, s2Time: 90.123, gap: 12.34 };
      const lap2 = { type: 'lap', driver: 'VAN', lapNumber: 2, lapTime: 90.123, gap: 22.34 };
      const d = appendMessage(appendMessage(newDriver(), lap1), lap2);

      assert(d.get('cumulativeTime').count().should.equal(2));
      assert(d.get('cumulativeTime').get(0).should.equal(12.34));
      assert.almostEqual(d.get('cumulativeTime').get(1), 102.463);
    });

    it('sets cumulative time to NaN in case of 0 laptime', () => {
      const lap1 = { type: 'lap', driver: 'VAN', lapNumber: 1, s2Time: 90.123, gap: 12.34 };
      const lap2 = { type: 'lap', driver: 'VAN', lapNumber: 2, lapTime: 0, gap: 22.34 };
      const d = appendMessage(appendMessage(newDriver(), lap1), lap2);

      assert(d.get('cumulativeTime').count().should.equal(2));
      assert(d.get('cumulativeTime').get(0).should.equal(12.34));
      assert(d.get('cumulativeTime').get(1).should.be.NaN);
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

    it('preserves laps, currentStatus and stints', () => {
      const msg = { type: 'lap', driver: 'VAN', lapNumber: 1, lapTime: 90.123 };
      const d = findBests(appendMessage(newDriver(), msg));

      assert(d.get('laps').count().should.equal(1));
      assert(d.get('currentStatus').should.equal(''));
      assert(d.get('stints').count().should.equal(0));
    });

    it('is the best for a driver with laps', () => {
      const msg1 = { type: 'lap',
        lapNumber: 1,
        s1Time: 31.111,
        s2Time: 32.222,
        s3Time: 33.333,
        lapTime: 94.111 };
      const msg2 = { type: 'lap',
        lapNumber: 2,
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
      const msg1 = { type: 'lap',
        lapNumber: 1,
        s1Time: NaN,
        s2Time: 32.222,
        s3Time: 33.333,
        lapTime: NaN };
      const msg2 = { type: 'lap',
        lapNumber: 2,
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
      const msg1 = { type: 'lap',
        lapNumber: 1,
        s1Time: null,
        s2Time: 32.222,
        s3Time: 33.333,
        lapTime: null };
      const msg2 = { type: 'lap',
        lapNumber: 2,
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
