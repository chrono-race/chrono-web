import { assert, should } from 'chai';
import sinon from 'sinon';
import * as actions from '../actions/data-actions';
import sessionReducer from './session-reducer';

should();

describe('session reducer', () => {
  it('returns empty state by default', () => {
    const state = sessionReducer(undefined, {});
    assert(state.should.deep.equal({drivers: {}}));
  });

  it('resets state on receipt of backlog message', () => {
    const initialState = { drivers: { VAN: { } } };
    const action = actions.backlogReceived([]);

    const state = sessionReducer(initialState, action);

    assert(state.should.deep.equal({ drivers: {} }));
  });

  it('adds a new driver to the session with first lap', () => {
    const initialState = { drivers: {} };
    const action = actions.backlogReceived([{driver: 'VAN', lapNumber: 1, lapTime: 90.123}]);

    const state = sessionReducer(initialState, action);

    assert(state.should.have.property('drivers'));
    assert(state.drivers.should.have.property('VAN'));
    assert(state.drivers.VAN.laps.length.should.equal(1));
    assert(state.drivers.VAN.laps[0].lapNumber.should.equal(1));
    assert(state.drivers.VAN.laps[0].lapTime.should.equal(90.123));
  });

  it('appends to a session on events message', () => {
    const initialState = {
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
    };
    const append = sinon.stub(initialState.drivers.VAN, 'appendMessage');
    const message = {driver: 'VAN', lapNumber: 2, lapTime: 92.222};
    const action = actions.eventsReceived([message]);

    const state = sessionReducer(initialState, action);

    assert(append.calledWith(message));
  });
});

