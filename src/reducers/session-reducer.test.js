import { assert, should } from 'chai';
import sessionReducer from './session-reducer';

should();

describe('session reducer', () => {
  it('returns empty state by default', () => {
    const state = sessionReducer(undefined, {});
    assert(state.should.deep.equal({}));
  });
});

