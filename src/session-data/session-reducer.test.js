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

  it('session is not active by default', () => {
    const state = sessionReducer(undefined, {});
    assert(state.get('active').should.equal(false));
  });

  it('does not mark session as active when a waiting message arrives', () => {
    const initialState = fromJS({ drivers: {}, active: false });
    const action = actions.backlogReceived([{ type: 'waiting', remainingSec: 42 }]);

    const state = sessionReducer(initialState, action);

    assert(state.get('active').should.equal(false));
  });

  it('marks session as active when any non-waiting message arrives', () => {
    const initialState = fromJS({ drivers: {}, active: false });
    const action = actions.backlogReceived([{ type: 'something' }]);

    const state = sessionReducer(initialState, action);

    assert(state.get('active').should.equal(true));
  });

  it('seconds until connect is nan by default', () => {
    const state = sessionReducer(undefined, {});
    assert(state.get('secondsUntilConnect').should.be.NaN);
  });

  it('seconds until connect updates from waiting message', () => {
    const initialState = fromJS({ drivers: {}, active: false });
    const action = actions.backlogReceived([{ type: 'waiting', remainingSec: 42 }]);

    const state = sessionReducer(initialState, action);

    assert(state.get('secondsUntilConnect').should.equal(42));
  });

  it('has NaN session bests initially', () => {
    const state = sessionReducer(undefined, {});
    assert(state.getIn('best', 's1Time').should.be.NaN);
    assert(state.getIn('best', 's2Time').should.be.NaN);
    assert(state.getIn('best', 's3Time').should.be.NaN);
    assert(state.getIn('best', 'lapTime').should.be.NaN);
    assert(state.get('time').should.be.NaN);
    assert(state.get('raceName').should.be.empty);
  });

  it('resets state on receipt of backlog message', () => {
    const initialState = fromJS({ drivers: { VAN: { } }, best: { s1Time: 12.345 } });
    const action = actions.backlogReceived([]);

    const state = sessionReducer(initialState, action);

    assert(state.get('drivers').count().should.equal(0));
    assert(state.getIn('best', 's1Time').should.be.NaN);
    assert(state.get('isOffline').should.equal(false));
  });

  it('marks session as offline on receipt of offline backlog', () => {
    const action = actions.offlineBacklogReceived([]);

    const state = sessionReducer(undefined, action);

    assert(state.get('isOffline').should.equal(true));
  });

  it('adds a new driver to the session with drivers message', () => {
    const initialState = fromJS({ drivers: {} });
    const action = actions.backlogReceived([{ type: 'drivers',
      drivers: [
        {
          color: 'ff0000',
          number: '42',
          team: 'racing',
          tla: 'TST',
          teamOrder: '2',
        },
      ] }]);

    const state = sessionReducer(initialState, action);

    assert(state.get('drivers').count().should.equal(1));
    assert(state.get('drivers').has('TST').should.equal(true));
    assert(state.get('drivers').get('TST').get('color').should.equal('#ff0000'));
    assert(state.get('drivers').get('TST').get('number').should.equal('42'));
    assert(state.get('drivers').get('TST').get('team').should.equal('racing'));
    assert(state.get('drivers').get('TST').get('tla').should.equal('TST'));
    assert(state.get('drivers').get('TST').get('teamOrder').should.equal('2'));
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

  it('sets race name on receipt of backlog message of type race_meta_data', () => {
    const initialState = fromJS({ drivers: {} });
    const action = actions.backlogReceived([{ type: 'race_meta_data', name: 'My Race' }]);
    const state = sessionReducer(initialState, action);

    assert(state.get('raceName').should.equal('My Race'));
  });

  it('sets total laps on receipt of backlog message of type race_meta_data', () => {
    const initialState = fromJS({ drivers: {} });
    const action = actions.backlogReceived([{ type: 'race_meta_data', totalLaps: 51 }]);
    const state = sessionReducer(initialState, action);

    assert(state.get('totalLaps').should.equal(51));
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
          cumulativeTime: [],
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

  it('appends to a driver on pit message', () => {
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
          cumulativeTime: [],
        },
      },
    });
    const append = sinon.stub(driver, 'appendMessage');
    append.returns(initialState.get('drivers').get('VAN'));
    const message = { type: 'pit', driver: 'VAN', currentState: 'in pit', stints: [] };
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

  it('adds to messages on receipt of race control message', () => {
    const state = sessionReducer(undefined, actions.eventsReceived([{ type: 'race_control_message', message: 'a message' }]));
    assert(state.get('messages').count().should.equal(1));
    assert(state.get('messages').get(0).get('message').should.equal('a message'));
  });
});

