import { ChatInputCommandInteraction } from "discord.js";
import { prisma } from "../../utils/database";
import { StatsEmbeds } from "../../components/embeds/stats";

export async function handleTop(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Fetch top 3 players for each category
    const [playtime, achievements, kills, blocks, distance] = await Promise.all(
      [
        prisma.playerStats.findMany({
          take: 3,
          orderBy: { playtime: "desc" },
          select: { username: true, playtime: true },
        }),
        prisma.playerStats.findMany({
          take: 3,
          orderBy: { achievements: "desc" },
          select: { username: true, achievements: true },
        }),
        prisma.playerStats.findMany({
          take: 3,
          orderBy: { kills: "desc" },
          select: { username: true, kills: true },
        }),
        prisma.playerStats.findMany({
          take: 3,
          orderBy: { blocks: "desc" },
          select: { username: true, blocks: true },
        }),
        prisma.playerStats.findMany({
          take: 3,
          orderBy: { distance: "desc" },
          select: { username: true, distance: true },
        }),
      ],
    );

    await interaction.editReply({
      embeds: [
        StatsEmbeds.topPlayers({
          playtime,
          achievements,
          kills,
          blocks,
          distance,
        }),
      ],
    });
  } catch (error) {
    console.error("Error fetching top players:", error);
    await interaction.editReply({
      embeds: [StatsEmbeds.error()],
    });
  }
}
