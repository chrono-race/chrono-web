import { fromJS } from 'immutable';
import * as types from '../actions/action-types';

const defaultState = fromJS([]);

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SESSION_LIST_RECEIVED:
      return fromJS(action.sessions);
    default:
      return state;
  }
};
