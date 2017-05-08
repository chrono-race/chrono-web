import * as types from '../actions/action-types';

const initialState = {
  selectedDriver: 'VAN',
  drivers: {
    VAN: {
      laps: [
        {
          position: 4,
          lapNumber: 1,
          s1Time: 12.345,
          s2Time: 23.456,
          s3Time: 34.567,
          lapTime: 97.123,
        },
        {
          position: 4,
          lapNumber: 2,
          s1Time: 22.345,
          s2Time: 33.456,
          s3Time: 44.567,
          lapTime: 107.123,
        }
      ], 
    },
    HAM: {
      laps: [
        {
          position: 1,
          lapNumber: 1,
          s1Time: 11.111,
          s2Time: 12.111,
          s3Time: 13.111,
          lapTime: 100.111,
        },
        {
          position: 1,
          lapNumber: 2,
          s1Time: 11.222,
          s2Time: 12.222,
          s3Time: 13.222,
          lapTime: 100.222,
        }
      ], 
    },
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SELECT_DRIVER:
      return {...state, selectedDriver: action.driver};
    default:
      return state;
  }
};
