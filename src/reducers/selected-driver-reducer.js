import { fromJS } from 'immutable';
import * as types from '../actions/action-types';

const defaultState = fromJS({
  selectedDriver: '',
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SELECT_DRIVER:
      return fromJS({
        selectedDriver: action.driver,
      });
    default:
      return state;
  }
};
