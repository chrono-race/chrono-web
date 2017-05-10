import { assert, should } from 'chai';
import driver from './driver';

should();

describe('driver', () => {
  it('starts with no laps', () => {
    const d = driver();
    assert(d.laps.length.should.equal(0));
  });

  it('adds first empty lap', () => {
    const d = driver();
    d.appendMessage({driver: 'VAN', lapNumber: 1, lapTime: 90.123});

    assert(d.laps.length.should.equal(1));
    assert(d.laps[0].lapNumber.should.equal(1));
    assert(d.laps[0].lapTime.should.equal(90.123));
  });

  it('adds missing laps', () => {
    const d = driver();
    d.appendMessage({driver: 'VAN', lapNumber: 1, lapTime: 90.123});

    d.appendMessage({driver: 'VAN', lapNumber: 3, lapTime: 93.333});

    assert(d.laps.length.should.equal(3));
    assert(d.laps[1].lapNumber.should.equal(2));
    assert(d.laps[1].lapTime.should.be.NaN);
    assert(d.laps[2].lapNumber.should.equal(3));
    assert(d.laps[2].lapTime.should.equal(93.333));
  })
});