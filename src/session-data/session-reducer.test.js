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
    assert(state.getIn('best', 's1Time').should.be.NaN);
    assert(state.getIn('best', 's2Time').should.be.NaN);
    assert(state.getIn('best', 's3Time').should.be.NaN);
    assert(state.getIn('best', 'lapTime').should.be.NaN);
  });

  it('resets state on receipt of backlog message', () => {
    const initialState = fromJS({ drivers: { VAN: { } }, best: { s1Time: 12.345 } });
    const action = actions.backlogReceived([]);

    const state = sessionReducer(initialState, action);

    assert(state.get('drivers').count().should.equal(0));
    assert(state.getIn('best', 's1Time').should.be.NaN);
  });

  it('adds a new driver to the session with first lap', () => {
    const initialState = fromJS({ drivers: {} });
    const action = actions.backlogReceived([{ type: 'lap', driver: 'VAN', lapNumber: 1, lapTime: 90.123 }]);

    const state = sessionReducer(initialState, action);

    assert(state.get('drivers').count().should.equal(1));
    assert(state.get('drivers').has('VAN').should.equal(true));
    assert(state.get('drivers').get('VAN').get('laps').count().should.equal(1));
    assert(state.getIn(['drivers', 'VAN', 'laps', 0, 'lapNumber']).should.equal(1));
    assert(state.getIn(['drivers', 'VAN', 'laps', 0, 'lapTime']).should.equal(90.123));
    assert(state.getIn(['drivers', 'VAN', 'best', 'lapTime']).should.equal(90.123));
  });

  it('appends to a session on events message', () => {
    const initialState = fromJS({
      drivers: {
        VAN: {
          laps: [
            {
              lapNumber: 1,
              lapTime: 90.111,
            },
          ],
          appendMessage: () => {},
        },
      },
    });
    const append = sinon.stub(driver, 'appendMessage');
    append.returns(initialState.get('drivers').get('VAN'));
    const message = { type: 'lap', driver: 'VAN', lapNumber: 2, lapTime: 92.222 };
    const action = actions.eventsReceived([message]);

    sessionReducer(initialState, action);

    assert(append.calledWith(sinon.match.any, message));

    append.restore();
  });

  it('recalculates session bests', () => {
    const initialState = fromJS({ drivers: {} });
    let state = sessionReducer(initialState, actions.eventsReceived([{ type: 'lap', driver: 'VAN', lapNumber: 1, s1Time: NaN, s2Time: 22.111, s3Time: 23.111, lapTime: 90.111 }]));
    state = sessionReducer(state, actions.eventsReceived([{ type: 'lap', driver: 'HAM', lapNumber: 1, s1Time: NaN, s2Time: 22.222, s3Time: 23.000, lapTime: 90.222 }]));
    state = sessionReducer(state, actions.eventsReceived([{ type: 'lap', driver: 'HAM', lapNumber: 2, s1Time: 21.111, s2Time: 22.222, s3Time: 23.001, lapTime: 90.000 }]));

    assert(state.get('best').get('s1Time').should.equal(21.111));
    assert(state.get('best').get('s2Time').should.equal(22.111));
    assert(state.get('best').get('s3Time').should.equal(23.000));
    assert(state.get('best').get('lapTime').should.equal(90.000));
  });

  it('has no time of day initially', () => {
    const state = sessionReducer(undefined, {});
    assert(state.get('time').should.be.NaN);
  });

  it('returns time unchanged on unrelated message', () => {
    const initialState = fromJS({ drivers: {}, time: 1001 });
    const state = sessionReducer(initialState, actions.eventsReceived([{ type: 'test' }]));
    assert(state.get('time').should.equal(1001));
  });

  it('updates time on receipt of time of day message', () => {
    const state = sessionReducer(undefined, actions.eventsReceived([{ type: 'time', time: 1234 }]));
    assert(state.get('time').should.equal(1234));
  });

  it('has no race control messages initially', () => {
    const state = sessionReducer(undefined, {});
    assert(state.get('messages').count().should.equal(0));
  });
});

