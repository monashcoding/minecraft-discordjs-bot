import { Client, Events, Collection } from "discord.js";
import type { BotClient, Command } from "./types";
import { ping } from "./commands/ping";
import { deployCommands } from "./utils/deploy-commands";
import { getConfig } from "./config";
import { whitelist } from "./commands/whitelist";
import { stats } from "./commands/stats";
import { PterodactylAPI } from "./utils/pterodactyl";
import { ServerStatusService } from "./services/serverStatus";

async function main() {
  console.log("Launching Discord Bot...");
  const config = getConfig();

  // Initialize client with commands collection
  const client = new Client({ intents: config.intents }) as BotClient;
  client.commands = new Collection<string, Command>();

  // Create Pterodactyl API instance
  const pterodactyl = new PterodactylAPI(
    process.env.PTERODACTYL_URL!,
    process.env.PTERODACTYL_API_KEY!,
    process.env.PTERODACTYL_SERVER_ID!,
  );

  // Initialize server status service
  let statusService: ServerStatusService;

  // Register commands
  const commands: Command[] = [ping, whitelist, stats];
  commands.forEach((command) => {
    client.commands.set(command.data.name, command);
  });

  // When the client is ready, run this code (only once)
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    deployCommands(commands, config.token, config.clientId, config.guildId);

    // Start server status monitoring
    statusService = new ServerStatusService(client, pterodactyl);
    statusService.start();
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
