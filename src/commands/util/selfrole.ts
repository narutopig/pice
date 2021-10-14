import {
    CommandInteraction,
    MessageEmbed,
    GuildMemberRoleManager,
} from "discord.js";
import { errorEmbed, successEmbed } from "../../embeds";
import { db } from "../../firebase";
import { GuildSelfRoleData } from "../../types";
import { hasRoleEmbed } from "./general";

function selfRolesDoc(guildId: string | null) {
    return db.doc(`/selfroles/${guildId}`);
}

async function selfRolesData(guildId: string | null) {
    const docRef = selfRolesDoc(guildId);
    return (await docRef.get()).data() as GuildSelfRoleData;
}

// organization stuff
export async function listRoles(interaction: CommandInteraction) {
    const allowedRoles = await selfRolesData(interaction.guildId);
    const guild = interaction.guild;
    const rolesReqs = allowedRoles.roles.map((id) => guild?.roles.fetch(id));
    const roles = await Promise.all(rolesReqs);
    const embed = new MessageEmbed()
        .setTitle("Self Roles")
        .addField(
            "Roles",
            roles
                .map((role) => role?.toString() + ` (id: ${role?.id})`)
                .join("\n")
        );
    return await interaction.reply({ embeds: [embed] });
}

export async function giveRole(interaction: CommandInteraction) {
    // list of allowed role ids
    const allowedRoles = await selfRolesData(interaction.guildId);
    const roleId = interaction.options.getString("roleid", true);
    if (!allowedRoles.roles.includes(roleId)) {
        const embed = errorEmbed({
            description: "You cannot give yourself this role",
        });
        return await interaction.reply({ embeds: [embed] });
    }
    const role = await interaction.guild?.roles.fetch(roleId ?? "");
    if (role) {
        try {
            await (interaction.member?.roles as GuildMemberRoleManager).add(
                roleId
            );
            const embed = successEmbed({
                description: `Gave you the role ${roleId}`,
            });
            return await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            const embed = errorEmbed({
                description: "Could not give you this role",
            });
            return await interaction.reply({ embeds: [embed] });
        }
    } else {
        const embed = errorEmbed({
            description: "This role does not exist",
        });
        return await interaction.reply({ embeds: [embed] });
    }
}

export async function removeRole(interaction: CommandInteraction) {
    // list of allowed role ids
    const allowedRoles = await selfRolesData(interaction.guildId);
    const roleId = interaction.options.getString("roleid", true);
    if (!allowedRoles.roles.includes(roleId)) {
        const embed = errorEmbed({
            description: "You cannot remove this role",
        });
        return await interaction.reply({ embeds: [embed] });
    }
    const role = await interaction.guild?.roles.fetch(roleId ?? "");
    if (role) {
        try {
            await (interaction.member?.roles as GuildMemberRoleManager).remove(
                roleId
            );
            const embed = successEmbed({
                description: `Removed role ${roleId}`,
            });
            return await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            const embed = errorEmbed({
                description: "Could not remove this role",
            });
            return await interaction.reply({ embeds: [embed] });
        }
    } else {
        const embed = errorEmbed({
            description: "This role does not exist",
        });
        return await interaction.reply({ embeds: [embed] });
    }
}

export async function addRole(interaction: CommandInteraction) {
    hasRoleEmbed(interaction, "MANAGE_ROLES");

    const docRef = db.doc(`/selfroles/${interaction.guildId}`);
    const allowedRoles = await selfRolesData(interaction.guildId);
    const roleId = interaction.options.getString("roleid", true);
    if (allowedRoles.roles.includes(roleId)) {
        return await interaction.reply({
            embeds: [
                errorEmbed({
                    description: "This role is already in the self roles list",
                }),
            ],
        });
    }
    try {
        await docRef.update({ roles: [...allowedRoles.roles, roleId] });
        const embed = successEmbed({
            description: `Added role ${roleId} to the self roles list`,
        });
        return await interaction.reply({ embeds: [embed] });
    } catch (err) {
        console.error(err);
        const embed = errorEmbed({
            description: "Something went wrong while updating database data",
        });
        return await interaction.reply({ embeds: [embed] });
    }
}

export async function deleteRole(interaction: CommandInteraction) {
    hasRoleEmbed(interaction, "MANAGE_ROLES");

    const docRef = db.doc(`/selfroles/${interaction.guildId}`);
    const allowedRoles = await selfRolesData(interaction.guildId);
    const roleId = interaction.options.getString("roleid", true);
    if (!allowedRoles.roles.includes(roleId)) {
        return await interaction.reply({
            embeds: [
                errorEmbed({
                    description: "This role is not in the self roles list",
                }),
            ],
        });
    }
    try {
        await docRef.update({
            roles: allowedRoles.roles.filter((r) => r !== roleId),
        });
        const embed = successEmbed({
            description: `Deleted role ${roleId} to the self roles list`,
        });
        return await interaction.reply({ embeds: [embed] });
    } catch (err) {
        console.error(err);
        const embed = errorEmbed({
            description: "Something went wrong while updating database data",
        });
        return await interaction.reply({ embeds: [embed] });
    }
}
