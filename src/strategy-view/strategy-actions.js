import * as types from '../actions/action-types';

// eslint-disable-next-line
export const updateStrategies = (driverLap, opponentLap) =>
 ({
   type: types.UPDATE_STRATEGIES,
   driverLap,
   opponentLap,
 });
