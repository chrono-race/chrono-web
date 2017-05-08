import * as types from '../actions/action-types';

export const selectDriver = (driver) => {
  return {
    type: types.SELECT_DRIVER,
    driver,
  }
};
