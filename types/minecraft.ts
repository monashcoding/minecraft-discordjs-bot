export interface MinecraftProfile {
  name: string;
  id: string; // UUID
  properties: Array<{
    name: string;
    value: string; // Base64 encoded skin data
  }>;
}
