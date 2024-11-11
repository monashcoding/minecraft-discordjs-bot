import { Client, ActivityType } from "discord.js";
import { PterodactylAPI } from "../utils/pterodactyl";

export class ServerStatusService {
  private readonly client: Client;
  private readonly pterodactyl: PterodactylAPI;
  private readonly updateInterval: number;
  private intervalId?: NodeJS.Timeout;

  constructor(
    client: Client,
    pterodactyl: PterodactylAPI,
    updateInterval: number = 30000, // Default 1 minute
  ) {
    this.client = client;
    this.pterodactyl = pterodactyl;
    this.updateInterval = updateInterval;
  }

  start(): void {
    // Initial update
    this.updateStatus();

    // Set interval for subsequent updates
    this.intervalId = setInterval(() => {
      this.updateStatus();
    }, this.updateInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async updateStatus(): Promise<void> {
    try {
      const state = await this.pterodactyl.getServerState();
      const players = await this.pterodactyl.getOnlinePlayers();

      if (!state) {
        this.client.user?.setPresence({
          activities: [
            {
              name: "Server Offline",
              type: ActivityType.Playing,
            },
          ],
          status: "dnd",
        });
        return;
      }

      const isOnline = state.current_state === "running";
      const status = isOnline ? "online" : "dnd";
      const activityName = isOnline
        ? `${players} player${players === 1 ? "" : "s"} online`
        : "Server Starting...";

      this.client.user?.setPresence({
        activities: [
          {
            name: activityName,
            type: ActivityType.Playing,
          },
        ],
        status,
      });
    } catch (error) {
      console.error("Error updating server status:", error);
      this.client.user?.setPresence({
        activities: [
          {
            name: "Status Unknown",
            type: ActivityType.Playing,
          },
        ],
        status: "idle",
      });
    }
  }
}
