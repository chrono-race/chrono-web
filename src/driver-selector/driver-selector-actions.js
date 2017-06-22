import * as types from '../actions/action-types';

export const selectDriver = driver =>  // eslint-disable-line import/prefer-default-export
  ({
    type: types.SELECT_DRIVER,
    driver,
  });

export const selectOpponent = driver =>  // eslint-disable-line import/prefer-default-export
  ({
    type: types.SELECT_OPPONENT,
    driver,
  });
