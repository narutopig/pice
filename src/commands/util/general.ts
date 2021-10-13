import { CommandInteraction, PermissionResolvable } from "discord.js";
import { errorEmbed } from "../../embeds";

export async function hasRoleEmbed(
    interaction: CommandInteraction,
    permission: PermissionResolvable
) {
    if (!interaction.memberPermissions?.has(permission)) {
        return await interaction.reply({
            embeds: [
                errorEmbed({
                    description: `You need the ${permission} permission to use this command.`,
                }),
            ],
        });
    }
}
