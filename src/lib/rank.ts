enum Rank {
  Cadet = "Cadet",
  Pilot = "Pilot",
  Commander = "Commander",
  Admiral = "Admiral",
  Captain = "Captain",
  General = "General",
}

const rankThresholds: { [key in Rank]: number } = {
  [Rank.Cadet]: 5000,
  [Rank.Pilot]: 10000,
  [Rank.Commander]: 20000,
  [Rank.Admiral]: 30000,
  [Rank.Captain]: 40000,
  [Rank.General]: Infinity,
};

function getRank(score: number): Rank {
  if (score < 5000) {
    return Rank.Cadet;
  } else if (score < 10000) {
    return Rank.Pilot;
  } else if (score < 20000) {
    return Rank.Commander;
  } else if (score < 30000) {
    return Rank.Admiral;
  } else if (score < 40000) {
    return Rank.Captain;
  } else {
    return Rank.General;
  }
}

function rankThreshold(rank: Rank): number {
  return rankThresholds[rank];
}

export { Rank, getRank, rankThreshold };
