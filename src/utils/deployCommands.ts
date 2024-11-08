import { REST, Routes } from "discord.js";
import type { Command } from "../types";

export async function deployCommands(
  commands: Command[],
  token: string,
  clientId: string,
  guildId: string,
): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log("Started refreshing application (/) commands.");

    const commandData = commands.map((command) => command.data.toJSON());

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandData,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error deploying commands:", error);
  }
}
