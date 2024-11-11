import {
  PterodactylResponse,
  PterodactylServerAttributes,
} from "../types/pterodactyl";

export class PterodactylAPI {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly serverId: string;

  constructor(baseUrl: string, apiKey: string, serverId: string) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.apiKey = apiKey;
    this.serverId = serverId;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async getServerState(): Promise<PterodactylServerAttributes | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/client/servers/${this.serverId}/resources`,
        { headers: this.headers },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as PterodactylResponse;
      return data.attributes;
    } catch (error) {
      console.error("Error fetching server state:", error);
      return null;
    }
  }

  async getOnlinePlayers(): Promise<number> {
    try {
      // Send command to list players
      const response = await fetch(
        `${this.baseUrl}/api/client/servers/${this.serverId}/command`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({ command: "list" }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return 0; // Default to 0, we'll get the actual count from the websocket
    } catch (error) {
      console.error("Error fetching online players:", error);
      return 0;
    }
  }
}
