import {
  SlashCommandBuilder,
  ComponentType,
  GuildMemberRoleManager,
} from "discord.js";
import type { Command } from "../types";
import { getMinecraftProfile } from "../utils/mojang-api";
import { prisma } from "../utils/database";
import { WhitelistEmbeds } from "../components/embeds/whitelist";
import { createConfirmationButtons } from "../components/buttons/confirmation";

export const whitelist: Command = {
  data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Whitelist a Minecraft player")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The Minecraft username to whitelist")
        .setRequired(true),
    ),

  async execute(interaction) {
    try {
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

      const username = interaction.options.getString("username", true);
      await interaction.deferReply();

      // Fetch Minecraft profile
      const profile = await getMinecraftProfile(username);

      if (!profile) {
        await interaction.editReply({
          embeds: [WhitelistEmbeds.playerNotFound(username)],
        });
        return;
      }

      // Check if already whitelisted
      const existing = await prisma.whitelistedPlayer.findUnique({
        where: { minecraftUuid: profile.id },
      });

      if (existing) {
        await interaction.editReply({
          embeds: [WhitelistEmbeds.alreadyWhitelisted(profile)],
        });
        return;
      }

      // Ask user for confirmation
      const reply = await interaction.editReply({
        embeds: [WhitelistEmbeds.confirmation(profile)],
        components: [createConfirmationButtons()],
      });

      const confirmation = await reply.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        time: 30000,
        componentType: ComponentType.Button,
      });

      if (confirmation.customId === "confirm") {
        // Add to database
        await prisma.whitelistedPlayer.create({
          data: {
            minecraftUsername: profile.name,
            minecraftUuid: profile.id,
            addedByDiscordId: interaction.user.id,
            addedByUsername: interaction.user.tag,
            addedByDisplayName: interaction.user.displayName,
          },
        });

        await confirmation.update({
          embeds: [WhitelistEmbeds.success(profile)],
          components: [],
        });
      } else {
        await confirmation.update({
          embeds: [WhitelistEmbeds.cancelled()],
          components: [],
        });
      }
    } catch (error) {
      await interaction.editReply({
        embeds: [WhitelistEmbeds.timeout()],
        components: [],
      });
    }
  },
};
