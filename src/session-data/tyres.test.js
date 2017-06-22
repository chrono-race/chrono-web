import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import { tyreClass, tyreText, tyrePrompt } from './tyres';

should();

describe('tyre class', () => {
  it('is empty for undefined stint', () => {
    assert(tyreClass(undefined).should.equal(''));
  });

  it('shows new for tyre with startAge 0', () => {
    const stint = fromJS({
      tyreAge: 0,
      tyre: 'M',
    });
    assert(tyreClass(stint).should.equal('new-M'));
  });

  it('shows used for tyre with startAge > 0', () => {
    const stint = fromJS({
      tyreAge: 1,
      tyre: 'M',
    });
    assert(tyreClass(stint).should.equal('used-M'));
  });
});

describe('tyre prompt', () => {
  it('is empty for undefined stint', () => {
    assert(tyrePrompt(undefined).should.equal(''));
  });

  it('shows new for tyre with startAge 0', () => {
    const stint = fromJS({
      tyreAge: 0,
      tyre: 'M',
    });
    assert(tyrePrompt(stint).should.equal('new medium'));
  });

  it('shows used for tyre with startAge > 0', () => {
    const stint = fromJS({
      tyreAge: 1,
      tyre: 'M',
    });
    assert(tyrePrompt(stint).should.equal('used medium'));
  });
});

describe('tyre text', () => {
  it('is empty for undefined stint', () => {
    assert(tyreText(undefined).should.equal(''));
  });

  it('is shows mapped tyre codes', () => {
    assert(tyreText(fromJS({ tyre: 'H' })).should.equal('H'));
    assert(tyreText(fromJS({ tyre: 'M' })).should.equal('M'));
    assert(tyreText(fromJS({ tyre: 'S' })).should.equal('S'));
    assert(tyreText(fromJS({ tyre: 'V' })).should.equal('SS'));
    assert(tyreText(fromJS({ tyre: 'E' })).should.equal('US'));
  });
});
