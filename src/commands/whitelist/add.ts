import { ChatInputCommandInteraction, ComponentType } from "discord.js";
import { prisma } from "@/utils/database";
import { WhitelistEmbeds } from "@/components/embeds/whitelist";
import { createConfirmationButtons } from "@/components/buttons/confirmation";
import { handlePlayerLookup } from "@/utils/player-lookup";

export async function handleAdd(interaction: ChatInputCommandInteraction) {
  const result = await handlePlayerLookup(interaction, {
    requireNotExists: true,
  });

  if (!result) return;
  const { profile } = result;

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
}
