import type { MinecraftProfile } from "@/types/minecraft";

export async function getMinecraftProfile(
  username: string,
): Promise<MinecraftProfile | null> {
  try {
    const response = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${username}`,
    );

    if (!response.ok) {
      return null;
    }

    const { id, name } = await response.json();

    // Get detailed profile with skin
    const profileResponse = await fetch(
      `https://sessionserver.mojang.com/session/minecraft/profile/${id}`,
    );

    if (!profileResponse.ok) {
      return null;
    }

    return profileResponse.json();
  } catch (error) {
    console.error("Error fetching Minecraft profile:", error);
    return null;
  }
}
