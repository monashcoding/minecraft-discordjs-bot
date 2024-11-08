import { ChatInputCommandInteraction, ComponentType } from "discord.js";
import { prisma } from "../../utils/database";
import { WhitelistEmbeds } from "../../components/embeds/whitelist";
import { createConfirmationButtons } from "../../components/buttons/confirmation";
import { handlePlayerLookup } from "../../utils/player-lookup";

export async function handleRemove(interaction: ChatInputCommandInteraction) {
  const result = await handlePlayerLookup(interaction, {
    requireExists: true,
  });

  if (!result) return;
  const { existingPlayer } = result;

  const reply = await interaction.editReply({
    embeds: [WhitelistEmbeds.removeConfirmation(existingPlayer)],
    components: [createConfirmationButtons()],
  });

  const confirmation = await reply.awaitMessageComponent({
    filter: (i) => i.user.id === interaction.user.id,
    time: 30000,
    componentType: ComponentType.Button,
  });

  if (confirmation.customId === "confirm") {
    await prisma.whitelistedPlayer.delete({
      where: { id: existingPlayer.id },
    });

    await confirmation.update({
      embeds: [WhitelistEmbeds.playerRemoved(existingPlayer.minecraftUsername)],
      components: [],
    });
  } else {
    await confirmation.update({
      embeds: [WhitelistEmbeds.cancelled()],
      components: [],
    });
  }
}
