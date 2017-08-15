import { assert, should } from 'chai';
import * as actions from './pit-time-actions';
import pitTimeReducer from './pit-time-reducer';

should();

describe('pit time reducer', () => {
  it('returns default state', () => {
    const state = pitTimeReducer(undefined, {});

    assert(state.get('sortByColumn').should.equal('timeLost'));
  });

  it('updates sort column', () => {
    const state = pitTimeReducer(undefined, actions.sortPitLaneTimes('lapNumber'));

    assert(state.get('sortByColumn').should.equal('lapNumber'));
  });
});
