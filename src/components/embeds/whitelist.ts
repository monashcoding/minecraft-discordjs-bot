import { EmbedBuilder, type APIEmbed } from "discord.js";
import { WhitelistedPlayer } from "@prisma/client";
import { MinecraftProfile } from "@/types/minecraft";

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

  static playerRemoved(username: string): APIEmbed {
    return new EmbedBuilder()
      .setTitle("✅  Player Removed")
      .setDescription(`Successfully removed ${username} from the whitelist.`)
      .setColor("#ffe430")
      .setTimestamp()
      .toJSON();
  }

  static removeConfirmation(player: WhitelistedPlayer): APIEmbed {
    return new EmbedBuilder()
      .setTitle("⚠️  Remove Confirmation")
      .setDescription(
        `Are you sure you want to remove ${player.minecraftUsername} from the whitelist?`,
      )
      .addFields(
        { name: "Username", value: player.minecraftUsername, inline: true },
        { name: "UUID", value: player.minecraftUuid, inline: true },
        { name: "Added By", value: player.addedByDisplayName, inline: true },
        {
          name: "Added At",
          value: player.addedAt.toLocaleDateString(),
          inline: true,
        },
      )
      .setThumbnail(`https://mc-heads.net/avatar/${player.id}/100`)
      .setTimestamp()
      .toJSON();
  }

  static playerInfo(player: WhitelistedPlayer): APIEmbed {
    return new EmbedBuilder()
      .setTitle("📋  Player Information")
      .setDescription(`Information for ${player.minecraftUsername}`)
      .addFields(
        { name: "Username", value: player.minecraftUsername, inline: true },
        { name: "UUID", value: player.minecraftUuid, inline: true },
        { name: "Added By", value: player.addedByUsername, inline: true },
        {
          name: "Added At",
          value: player.addedAt.toLocaleDateString(),
          inline: true,
        },
        {
          name: "Status",
          value: player.isActive ? "✅ Active" : "❌ Inactive",
          inline: true,
        },
      )
      .setColor("#ffe430")
      .setThumbnail(`https://mc-heads.net/avatar/${player.minecraftUuid}/100`)
      .setTimestamp()
      .toJSON();
  }

  static whitelistList(
    players: WhitelistedPlayer[],
    page: number,
    totalPages: number,
  ): APIEmbed {
    return new EmbedBuilder()
      .setTitle("📋  Whitelisted Players")
      .setDescription(
        players.length === 0
          ? "No whitelisted players found."
          : players
              .map(
                (p, index) =>
                  `${index + 1}. **${p.minecraftUsername}**\n` +
                  `┗ Added by ${p.addedByUsername} on ${p.addedAt.toLocaleDateString()}`,
              )
              .join("\n\n"),
      )
      .setFooter({
        text: `Page ${page} of ${totalPages} • ${players.length} players shown`,
      })
      .setColor("#ffe430")
      .setTimestamp()
      .toJSON();
  }

  static listTimeout(): APIEmbed {
    return new EmbedBuilder()
      .setTitle("⏰  Navigation Expired")
      .setDescription(
        "The navigation buttons have expired. Use the command again to view more pages.",
      )
      .setTimestamp()
      .toJSON();
  }

  static notFound(username: string): APIEmbed {
    return new EmbedBuilder()
      .setTitle("❌  Not Found")
      .setDescription(`${username} is not on the whitelist.`)
      .setColor("#ff0000")
      .setTimestamp()
      .toJSON();
  }
}
