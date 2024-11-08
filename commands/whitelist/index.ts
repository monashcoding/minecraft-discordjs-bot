import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMemberRoleManager,
} from "discord.js";
import type { Command } from "../../types";
import { WhitelistEmbeds } from "../../components/embeds/whitelist";
import { handleAdd } from "./add";
import { handleRemove } from "./remove";
import { handleCheck } from "./check";
import { handleList } from "./list";

export const whitelist: Command = {
  data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Manage the Minecraft server whitelist")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a player to the whitelist")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The Minecraft username to whitelist")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a player from the whitelist")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The Minecraft username to remove")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check")
        .setDescription("Check if a player is whitelisted")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The Minecraft username to check")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all whitelisted players")
        .addIntegerOption((option) =>
          option.setName("page").setDescription("Page number").setMinValue(1),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    // Check if user has the required role
    let hasRole = false;

    if (interaction.member.roles instanceof GuildMemberRoleManager) {
      hasRole = interaction.member.roles.cache.has(
        process.env.WHITELIST_ROLE_ID,
      );
    } else if (Array.isArray(interaction.member.roles)) {
      hasRole = interaction.member.roles.includes(
        process.env.WHITELIST_ROLE_ID,
      );
    }

    if (!hasRole) {
      await interaction.reply({
        embeds: [WhitelistEmbeds.noPermission()],
        ephemeral: true,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "add":
          await handleAdd(interaction);
          break;
        case "remove":
          await handleRemove(interaction);
          break;
        case "check":
          await handleCheck(interaction);
          break;
        case "list":
          await handleList(interaction);
          break;
      }
    } catch (error) {
      console.error(`Error in whitelist ${subcommand}:`, error);
      await interaction.editReply({
        embeds: [WhitelistEmbeds.error()],
        components: [],
      });
    }
  },
};
