import * as types from '../actions/action-types';

export const selectModellingTab = tab =>  // eslint-disable-line import/prefer-default-export
  ({
    type: types.SELECT_MODEL_TAB,
    tab,
  });
