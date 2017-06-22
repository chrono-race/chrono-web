import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import bestClass from './bestClass';

should();

describe('bestClass', () => {
  it('returns none by default', () => {
    const lap = fromJS({
      s1Time: 12.345,
    });
    const driverBests = fromJS({
      s1Time: NaN,
    });
    const sessionBests = fromJS({
      s1Time: NaN,
    });
    const className = bestClass('s1Time', lap, driverBests, sessionBests);
    assert(className.should.equal('s1Time none'));
  });

  it('returns personal best if time matches session best', () => {
    const lap = fromJS({
      s1Time: 12.345,
    });
    const driverBests = fromJS({
      s1Time: 12.345,
    });
    const sessionBests = fromJS({
      s1Time: NaN,
    });
    const className = bestClass('s1Time', lap, driverBests, sessionBests);
    assert(className.should.equal('s1Time personalBest'));
  });

  it('returns session best if time matches session best', () => {
    const lap = fromJS({
      s1Time: 12.345,
    });
    const driverBests = fromJS({
      s1Time: NaN,
    });
    const sessionBests = fromJS({
      s1Time: 12.345,
    });
    const className = bestClass('s1Time', lap, driverBests, sessionBests);
    assert(className.should.equal('s1Time sessionBest'));
  });

  it('returns session best if time matches personal & session best', () => {
    const lap = fromJS({
      s1Time: 12.345,
    });
    const driverBests = fromJS({
      s1Time: 12.345,
    });
    const sessionBests = fromJS({
      s1Time: 12.345,
    });
    const className = bestClass('s1Time', lap, driverBests, sessionBests);
    assert(className.should.equal('s1Time sessionBest'));
  });
});
