import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export function createPaginationButtons(
  currentPage: number,
  totalPages: number,
) {
  const previous = new ButtonBuilder()
    .setCustomId("previous")
    .setLabel("◀️ Previous")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(currentPage <= 1);

  const next = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next ▶️")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(currentPage >= totalPages);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(previous, next);
}
