import leaderOnLap from './leader-on-lap';

function getLeaderLapTime(lapNumber, times) {
  const leader = leaderOnLap(times, lapNumber);
  const leaderLaps = times.get(leader);
  const prevLap = leaderLaps.get(lapNumber - 1);
  const thisLap = leaderLaps.get(lapNumber);
  const lapTime = thisLap - prevLap;
  return lapTime;
}

export default getLeaderLapTime;
