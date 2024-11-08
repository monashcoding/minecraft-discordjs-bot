import { ChatInputCommandInteraction } from "discord.js";
import { WhitelistEmbeds } from "../../components/embeds/whitelist";
import { handlePlayerLookup } from "../../utils/player-lookup";

export async function handleCheck(interaction: ChatInputCommandInteraction) {
  const result = await handlePlayerLookup(interaction, {
    requireExists: true,
  });

  if (!result) return;
  const { existingPlayer } = result;

  await interaction.editReply({
    embeds: [WhitelistEmbeds.playerInfo(existingPlayer)],
  });
}
