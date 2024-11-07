import { Client, Events, Collection } from "discord.js";
import type { BotClient, Command } from "./types";
import { ping } from "./commands/ping";
import { deployCommands } from "./utils/deployCommands";
import { getConfig } from "./config";

async function main() {
  console.log("Launching Discord Bot...");
  const config = getConfig();

  // Initialize client with commands collection
  const client = new Client({ intents: config.intents }) as BotClient;
  client.commands = new Collection<string, Command>();

  // Register commands
  const commands: Command[] = [ping];
  commands.forEach((command) => {
    client.commands.set(command.data.name, command);
  });

  // When the client is ready, run this code (only once)
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    deployCommands(commands, config.token, config.clientId, config.guildId);
  });

  // Handle interactions
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      const content = "There was an error executing this command!";
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, ephemeral: true });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    }
  });

  // Log in to Discord
  await client.login(config.token);
}

main().catch(console.error);
