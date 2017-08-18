import * as types from '../actions/action-types';

export const updateDriverStrategy = lapsUntilStop =>
 ({
   type: types.UPDATE_DRIVER_STRATEGY,
   lapsUntilStop,
 });

export const updateOpponentStrategy = lapsUntilStop =>
 ({
   type: types.UPDATE_OPPONENT_STRATEGY,
   lapsUntilStop,
 });
