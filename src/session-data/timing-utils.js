export const toSectorTime = (time) => {
  if (time === undefined || time === null || time < 0) {
    return '';
  }
  return time.toFixed(3);
};

export const toGapTime = (time) => {
  if (time < 0) {
    const lapDown = -1 * time;
    return `${lapDown}L`;
  }

  return toSectorTime(time);
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

function pad(v) {
  if (isNaN(v)) {
    return '--';
  }
  if (v >= 10) {
    return v;
  }
  return `0${v}`;
}

export const toTimeOfDay = (time) => {
  const timeWithinDay = time % (60 * 60 * 24);
  const hour = Math.floor(timeWithinDay / (60 * 60));
  const minute = Math.floor(timeWithinDay / 60) % 60;
  const seconds = timeWithinDay % 60;
  return `${pad(hour)}:${pad(minute)}:${pad(seconds)}`;
};

