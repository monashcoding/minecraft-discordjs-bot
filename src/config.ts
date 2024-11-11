import dotenv from "dotenv";
import { GatewayIntentBits } from "discord.js";

dotenv.config();

interface Config {
  token: string;
  clientId: string;
  guildId: string;
  intents: GatewayIntentBits[];
}

export function getConfig(): Config {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!token || !clientId || !guildId) {
    throw new Error("Missing required environment variables");
  }

  return {
    token,
    clientId,
    guildId,
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.MessageContent,
    ],
  };
}
