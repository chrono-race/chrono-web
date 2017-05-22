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

  it('has NaN session bests initially', () => {
    const state = sessionReducer(undefined, {});
    assert(state.get('best').get('s1Time').should.be.NaN);
    assert(state.get('best').get('s2Time').should.be.NaN);
    assert(state.get('best').get('s3Time').should.be.NaN);
    assert(state.get('best').get('lapTime').should.be.NaN);
  });

  it('resets state on receipt of backlog message', () => {
    const initialState = fromJS({ drivers: { VAN: { } }, best: { s1Time: 12.345 } });
    const action = actions.backlogReceived([]);

    const state = sessionReducer(initialState, action);

    assert(state.get('drivers').count().should.equal(0));
    assert(state.get('best').get('s1Time').should.be.NaN);
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
    assert(state.get('drivers').get('VAN').get('best').get('lapTime').should.equal(90.123));
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
    append.returns(initialState.get('drivers').get('VAN'));
    const message = {driver: 'VAN', lapNumber: 2, lapTime: 92.222};
    const action = actions.eventsReceived([message]);

    const state = sessionReducer(initialState, action);

    assert(append.calledWith(sinon.match.any, message));

    append.restore();
  });
});

