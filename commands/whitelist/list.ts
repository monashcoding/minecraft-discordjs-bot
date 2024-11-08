import { ChatInputCommandInteraction, ComponentType } from "discord.js";
import { prisma } from "../../utils/database";
import { WhitelistEmbeds } from "../../components/embeds/whitelist";
import { createPaginationButtons } from "../../components/buttons/pagination";

export async function handleList(interaction: ChatInputCommandInteraction) {
  const ITEMS_PER_PAGE = 10;
  let currentPage = interaction.options.getInteger("page") || 1;

  await interaction.deferReply();

  async function fetchPageData(page: number) {
    const totalPlayers = await prisma.whitelistedPlayer.count({
      where: { isActive: true },
    });

    const totalPages = Math.max(1, Math.ceil(totalPlayers / ITEMS_PER_PAGE));
    const validPage = Math.min(Math.max(1, page), totalPages);

    const players = await prisma.whitelistedPlayer.findMany({
      where: { isActive: true },
      skip: (validPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { addedAt: "desc" },
    });

    return { players, totalPages, validPage };
  }

  async function updateMessage(page: number) {
    const { players, totalPages, validPage } = await fetchPageData(page);
    return {
      embeds: [WhitelistEmbeds.whitelistList(players, validPage, totalPages)],
      components: [createPaginationButtons(validPage, totalPages)],
    };
  }

  // Initial reply
  const initialMessage = await interaction.editReply(
    await updateMessage(currentPage),
  );

  // Create collector for button interactions
  const collector = initialMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 300000, // 5 minutes
    filter: (i) => i.user.id === interaction.user.id,
  });

  collector.on("collect", async (i) => {
    // Update current page based on button clicked
    if (i.customId === "previous") {
      currentPage--;
    } else if (i.customId === "next") {
      currentPage++;
    }

    // Update the message with new page data
    await i.update(await updateMessage(currentPage));
  });

  collector.on("end", async () => {
    // When collector expires, remove the buttons
    const { players, totalPages, validPage } = await fetchPageData(currentPage);
    await interaction
      .editReply({
        embeds: [WhitelistEmbeds.whitelistList(players, validPage, totalPages)],
        components: [], // Remove buttons
      })
      .catch(() => {}); // Ignore errors if message is too old
  });
}
