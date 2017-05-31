export const toSectorTime = (time) => {
  if (time === undefined || time === null || time < 0) {
    return '';
  }
  return time.toFixed(3);
};

export const toLapTime = (t) => {
  if (t === null || t === undefined) {
    return '';
  }
  const minutes = Math.floor(t / 60);
  let seconds = (t % 60);
  if (seconds < 10) {
    seconds = `0${seconds.toFixed(3)}`;
  } else {
    seconds = seconds.toFixed(3);
  }
  return `${minutes}:${seconds}`;
};

