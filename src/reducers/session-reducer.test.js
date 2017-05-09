import { assert, should } from 'chai';
import * as actions from '../actions/data-actions';
import sessionReducer from './session-reducer';

should();

describe('session reducer', () => {
  it('returns empty state by default', () => {
    const state = sessionReducer(undefined, {});
    assert(state.should.deep.equal({}));
  });

  it('resets state on receipt of backlog message', () => {
    const initialState = { drivers: { VAN: { } } };
    const action = actions.backlogReceived([]);

    const state = sessionReducer(initialState, action);

    assert(state.should.deep.equal({ drivers: {} }));
  });

  it('adds a new driver to the session with first lap', () => {
    const initialState = { drivers: { VAN: { } } };
    const action = actions.backlogReceived([{driver: 'VAN', lapNumber: 1, lapTime: 90.123}]);

    const state = sessionReducer(initialState, action);

    assert(state.should.deep.equal({ drivers: { VAN: { laps: [ { driver: 'VAN', lapNumber: 1, lapTime: 90.123 }] } } }));
  });
});

