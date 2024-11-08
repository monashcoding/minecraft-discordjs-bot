import { ChatInputCommandInteraction } from "discord.js";
import { WhitelistedPlayer } from "@prisma/client";
import { prisma } from "./database";
import { WhitelistEmbeds } from "@/components/embeds/whitelist";
import type { MinecraftProfile } from "@/types/minecraft";
import { getMinecraftProfile } from "./mojang-api";

interface PlayerLookupResult {
  profile: MinecraftProfile;
  existingPlayer: WhitelistedPlayer | null;
}

export async function lookupPlayer(
  username: string,
): Promise<PlayerLookupResult | null> {
  const profile = await getMinecraftProfile(username);

  if (!profile) {
    return null;
  }

  const existingPlayer = await prisma.whitelistedPlayer.findFirst({
    where: {
      minecraftUuid: profile.id,
    },
  });

  return { profile, existingPlayer };
}

export async function handlePlayerLookup(
  interaction: ChatInputCommandInteraction,
  options: {
    requireExists?: boolean;
    requireNotExists?: boolean;
  } = {},
): Promise<PlayerLookupResult | null> {
  const username = interaction.options.getString("username", true);
  await interaction.deferReply();

  const result = await lookupPlayer(username);

  if (!result) {
    await interaction.editReply({
      embeds: [WhitelistEmbeds.playerNotFound(username)],
    });
    return null;
  }

  if (options.requireExists && !result.existingPlayer) {
    await interaction.editReply({
      embeds: [WhitelistEmbeds.notFound(username)],
    });
    return null;
  }

  if (options.requireNotExists && result.existingPlayer) {
    await interaction.editReply({
      embeds: [WhitelistEmbeds.alreadyWhitelisted(result.profile)],
    });
    return null;
  }

  return result;
}
