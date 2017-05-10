
export default () => {
  return { 
    laps: [],
    appendMessage(msg) {
      if (this.laps.length < msg.lapNumber) {
        this.laps.push({});
      }
      this.laps[msg.lapNumber-1] = Object.assign(this.laps[msg.lapNumber-1], msg);
    },
  };
};
