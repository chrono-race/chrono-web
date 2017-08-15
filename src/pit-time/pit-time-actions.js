import * as types from '../actions/action-types';

// eslint-disable-next-line
export const sortPitLaneTimes = column =>
 ({
   type: types.SORT_PIT_TIME,
   column,
 });
