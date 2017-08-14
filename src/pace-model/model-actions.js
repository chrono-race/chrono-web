import * as types from '../actions/action-types';

export const selectModellingTyre = tyre =>
 ({
   type: types.SELECT_MODEL_TYRE,
   tyre,
 });

export const toggleModelHelp = () =>
  ({
    type: types.TOGGLE_MODEL_HELP,
  });
