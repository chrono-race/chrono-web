
function emptyLap(lapNumber) {
  return {
    lapNumber,
    lapTime: NaN,
    gap: NaN,
    interval: NaN,
    position: NaN,
    s1Time: NaN,
    s2Time: NaN,
    s3Time: NaN,
    speed1: NaN,
    speed2: NaN,
    speed3: NaN,
    speedTrap: NaN,
    timestamp: NaN,
  }
}

export default () => {
  return { 
    laps: [],
    appendMessage(msg) {
      while (this.laps.length < msg.lapNumber) {
        this.laps.push(emptyLap(this.laps.length+1));
      }
      this.laps[msg.lapNumber-1] = Object.assign(this.laps[msg.lapNumber-1], msg);
    },
  };
};
