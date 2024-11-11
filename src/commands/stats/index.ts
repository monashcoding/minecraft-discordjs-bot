import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../../types";
import { StatsEmbeds } from "../../components/embeds/stats";
import { handleCheck } from "./check";
import { handleTop } from "./top";

export const stats: Command = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View Minecraft statistics")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check")
        .setDescription("Check a specific player's statistics")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The Minecraft username to check")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("top")
        .setDescription("View top players in each category"),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "check":
          await handleCheck(interaction);
          break;
        case "top":
          await handleTop(interaction);
          break;
      }
    } catch (error) {
      console.error(`Error in stats ${subcommand}:`, error);
      await interaction.editReply({
        embeds: [StatsEmbeds.error()],
      });
    }
  },
};
