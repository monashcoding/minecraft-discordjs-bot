import { EmbedBuilder, type APIEmbed } from "discord.js";
import type { MinecraftProfile } from "../../types/minecraft";

export class WhitelistEmbeds {
  static noPermission(): APIEmbed {
    return new EmbedBuilder()
      .setTitle("❌  Permission Denied")
      .setDescription("You do not have permission to use this command.")
      .setColor("#ff0000")
      .setTimestamp()
      .toJSON();
  }

  static playerNotFound(username: string): APIEmbed {
    return new EmbedBuilder()
      .setTitle("❌  Player Not Found")
      .setDescription(
        `Could not find a Minecraft player with username: ${username}`,
      )
      .setColor("#ff0000")
      .setTimestamp()
      .toJSON();
  }

  static alreadyWhitelisted(profile: MinecraftProfile): APIEmbed {
    return new EmbedBuilder()
      .setTitle("⚠️  Already Whitelisted")
      .setDescription(`Player ${profile.name} is already whitelisted.`)
      .setThumbnail(`https://mc-heads.net/avatar/${profile.id}/100`)
      .setTimestamp()
      .toJSON();
  }

  static confirmation(profile: MinecraftProfile): APIEmbed {
    return new EmbedBuilder()
      .setTitle("✅  Whitelist Confirmation")
      .setDescription(`Are you sure you want to whitelist ${profile.name}?`)
      .setThumbnail(`https://mc-heads.net/avatar/${profile.id}/100`)
      .addFields(
        { name: "Username", value: profile.name, inline: true },
        { name: "UUID", value: profile.id, inline: true },
      )
      .setTimestamp()
      .toJSON();
  }

  static success(profile: MinecraftProfile): APIEmbed {
    return new EmbedBuilder()
      .setTitle("✅  Success")
      .setDescription(`Successfully whitelisted ${profile.name}!`)
      .setThumbnail(`https://mc-heads.net/avatar/${profile.id}/100`)
      .setColor("#ffe430")
      .setTimestamp()
      .toJSON();
  }

  static cancelled(): APIEmbed {
    return new EmbedBuilder()
      .setTitle("⚠️  Cancelled")
      .setDescription("Whitelist request cancelled.")
      .setTimestamp()
      .toJSON();
  }

  static timeout(): APIEmbed {
    return new EmbedBuilder()
      .setTitle("⚠️  Timeout")
      .setDescription(
        "Confirmation not received within 30 seconds, cancelling whitelist.",
      )
      .setTimestamp()
      .toJSON();
  }

  static error(): APIEmbed {
    return new EmbedBuilder()
      .setTitle("❌  Error")
      .setDescription("An error occurred while processing your request.")
      .setColor("#ff0000")
      .setTimestamp()
      .toJSON();
  }
}
