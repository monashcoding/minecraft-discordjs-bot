export interface MinecraftProfile {
  name: string;
  id: string; // UUID
  properties: Array<{
    name: string;
    value: string; // Base64 encoded skin data
  }>;
}

export interface PlayerRankings {
  playtimeRank: number;
  achievementsRank: number;
  killsRank: number;
  deathsRank: number;
  blocksRank: number;
  distanceRank: number;
  lastCalculated: Date;
}

export interface PlayerStatsType {
  uuid: string;
  username: string;
  playtime: number;
  achievements: number;
  blocks: number;
  deaths: number;
  distance: number;
  kills: number;
  lastUpdated: Date;
  rankings: PlayerRankings;
}
