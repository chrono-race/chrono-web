
const initialState = {
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
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
