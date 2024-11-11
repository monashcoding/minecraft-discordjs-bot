import { ChatInputCommandInteraction } from "discord.js";
import { prisma } from "../../utils/database";
import { StatsEmbeds } from "../../components/embeds/stats";

export async function handleCheck(interaction: ChatInputCommandInteraction) {
  const username = interaction.options.getString("username", true);
  await interaction.deferReply();

  try {
    const stats = await prisma.playerStats.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
      },
    });

    if (!stats) {
      await interaction.editReply({
        embeds: [StatsEmbeds.statsNotFound(username)],
      });
      return;
    }

    await interaction.editReply({
      embeds: [StatsEmbeds.playerStats(stats)],
    });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    await interaction.editReply({
      embeds: [StatsEmbeds.error()],
    });
  }
}
