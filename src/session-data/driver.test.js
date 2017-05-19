import { assert, should } from 'chai';
import { newDriver, appendMessage } from './driver';

should();

describe('driver', () => {
  it('starts with no laps', () => {
    const d = newDriver();
    assert(d.get('laps').isEmpty().should.equal(true));
  });

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
  })
});