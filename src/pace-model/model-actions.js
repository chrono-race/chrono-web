import * as types from '../actions/action-types';

export const selectModellingTab = tab =>  // eslint-disable-line import/prefer-default-export
  ({
    type: types.SELECT_MODEL_TAB,
    tab,
  });

export const selectModellingTyre = tyre =>
 ({
   type: types.SELECT_MODEL_TYRE,
   tyre,
 });

export const toggleModelHelp = () =>
  ({
    type: types.TOGGLE_MODEL_HELP,
  });
