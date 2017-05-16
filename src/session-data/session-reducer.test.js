import { assert, should } from 'chai';
import sinon from 'sinon';
import { fromJS } from 'immutable';
import * as actions from '../actions/data-actions';
import sessionReducer from './session-reducer';
import * as driver from './driver';

should();

describe('session reducer', () => {
  it('returns empty state by default', () => {
    const state = sessionReducer(undefined, {});
    assert(state.get('drivers').count().should.equal(0));
  });

  it('resets state on receipt of backlog message', () => {
    const initialState = fromJS({ drivers: { VAN: { } } });
    const action = actions.backlogReceived([]);

    const state = sessionReducer(initialState, action);

    assert(state.get('drivers').count().should.equal(0));
  });

  it('adds a new driver to the session with first lap', () => {
    const initialState = fromJS({ drivers: {} });
    const action = actions.backlogReceived([{driver: 'VAN', lapNumber: 1, lapTime: 90.123}]);

    const state = sessionReducer(initialState, action);

    assert(state.get('drivers').count().should.equal(1));
    assert(state.get('drivers').has('VAN').should.equal(true));
    assert(state.get('drivers').get('VAN').get('laps').count().should.equal(1));
    assert(state.get('drivers').get('VAN').get('laps').get(0).get('lapNumber').should.equal(1));
    assert(state.get('drivers').get('VAN').get('laps').get(0).get('lapTime').should.equal(90.123));
  });

  it('appends to a session on events message', () => {
    const initialState = fromJS({
      drivers: {
        VAN: {
          laps: [
            {
              lapNumber: 1,
              lapTime: 90.111,
            }
          ],
          appendMessage: () => {},
        },
      },
    });
    const append = sinon.stub(driver, 'appendMessage');
    const message = {driver: 'VAN', lapNumber: 2, lapTime: 92.222};
    const action = actions.eventsReceived([message]);

    const state = sessionReducer(initialState, action);

    assert(append.calledWith(sinon.match.any, message));

    append.restore();
  });
});

