import { EmbedBuilder, type APIEmbed } from "discord.js";
import { playerStats } from "@prisma/client";

interface TopPlayersData {
  playtime: { username: string; playtime: number }[];
  achievements: { username: string; achievements: number }[];
  kills: { username: string; kills: number }[];
  blocks: { username: string; blocks: number }[];
  distance: { username: string; distance: number }[];
}

export class StatsEmbeds {
  static formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;

    if (days > 0) {
      return `${days}d ${remainingHours}h ${remainingMinutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  }

  static formatDistance(blocks: number): string {
    const kilometers = (blocks / 1000).toFixed(1);
    return `${kilometers}km`;
  }

  static getRankEmoji(rank: number): string {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  }

  static playerStats(stats: playerStats): APIEmbed {
    const lastUpdatedTime = stats.lastUpdated.toLocaleString();
    const rankingsTime = stats.rankings.lastCalculated.toLocaleString();

    return new EmbedBuilder()
      .setTitle(`📊 Stats for ${stats.username}`)
      .setDescription(`Last online: ${lastUpdatedTime}`)
      .addFields([
        {
          name: "⏱️ Playtime",
          value: `${this.getRankEmoji(stats.rankings.playtimeRank)} ${this.formatTime(stats.playtime)}`,
          inline: true,
        },
        {
          name: "🏆 Achievements",
          value: `${this.getRankEmoji(stats.rankings.achievementsRank)} ${stats.achievements}`,
          inline: true,
        },
        {
          name: "⚔️ Kills",
          value: `${this.getRankEmoji(stats.rankings.killsRank)} ${stats.kills}`,
          inline: true,
        },
        {
          name: "☠️ Deaths",
          value: `${this.getRankEmoji(stats.rankings.deathsRank)} ${stats.deaths}`,
          inline: true,
        },
        {
          name: "🏗️ Blocks Placed",
          value: `${this.getRankEmoji(stats.rankings.blocksRank)} ${stats.blocks.toLocaleString()}`,
          inline: true,
        },
        {
          name: "🏃 Distance",
          value: `${this.getRankEmoji(stats.rankings.distanceRank)} ${this.formatDistance(stats.distance)}`,
          inline: true,
        },
      ])
      .setFooter({ text: `Rankings last calculated: ${rankingsTime}` })
      .setColor("#00ff00")
      .setThumbnail(`https://mc-heads.net/avatar/${stats.uuid}/100`)
      .setTimestamp()
      .toJSON();
  }

  static topPlayers(data: TopPlayersData): APIEmbed {
    const formatTopList = (
      players: any[],
      value: keyof (typeof players)[0],
      formatter?: (val: number) => string,
    ) => {
      return players
        .map((player, index) => {
          const formattedValue = formatter
            ? formatter(player[value])
            : player[value].toLocaleString();
          return `${this.getRankEmoji(index + 1)} ${player.username}: ${formattedValue}`;
        })
        .join("\n");
    };

    return new EmbedBuilder()
      .setTitle("🏆 Top Players")
      .setDescription("Top 3 players in each category")
      .addFields([
        {
          name: "⏱️ Playtime",
          value: formatTopList(data.playtime, "playtime", this.formatTime),
          inline: true,
        },
        {
          name: "🎯 Achievements",
          value: formatTopList(data.achievements, "achievements"),
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "⚔️ Kills",
          value: formatTopList(data.kills, "kills"),
          inline: true,
        },
        {
          name: "🏗️ Blocks Placed",
          value: formatTopList(data.blocks, "blocks"),
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "🏃 Distance Traveled",
          value: formatTopList(data.distance, "distance", this.formatDistance),
          inline: true,
        },
      ])
      .setColor("#ffd700")
      .setTimestamp()
      .toJSON();
  }

  static statsNotFound(username: string): APIEmbed {
    return new EmbedBuilder()
      .setTitle("❌ Stats Not Found")
      .setDescription(`No stats found for player ${username}`)
      .setColor("#ff0000")
      .setTimestamp()
      .toJSON();
  }

  static error(): APIEmbed {
    return new EmbedBuilder()
      .setTitle("❌ Error")
      .setDescription("An error occurred while fetching player stats.")
      .setColor("#ff0000")
      .setTimestamp()
      .toJSON();
  }
}
