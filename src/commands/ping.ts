import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong and latency!"),

  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply({
      content: `🏓 Pong!\n📶 Latency: ${latency}ms\n🌐 API Latency: ${apiLatency}ms`,
    });
  },
};
