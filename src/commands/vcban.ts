import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { db, readFile } from "../firebase";
import { errorEmbed, successEmbed } from "../embeds";
import { hasRoleEmbed } from "./util/general";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vcban")
        .setDescription("Prevent user from joining VCs")
        .addMentionableOption((option) =>
            option
                .setName("member")
                .setDescription("User to ban from joining VCs")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        hasRoleEmbed(interaction, "MUTE_MEMBERS");

        const target = interaction.options.getMentionable(
            "member",
            true
        ) as GuildMember;
        const vcBanRole = await readFile(`/guilds/${interaction.guildId}`);
        const roleId = vcBanRole?.vcBanRoleId;
        const role = await interaction.guild?.roles.fetch(roleId);
        if (target.roles.cache.has(roleId)) {
            return await interaction.reply({
                embeds: [
                    errorEmbed({
                        description: "This user is already VC banned",
                    }),
                ],
            });
        }
        if (!role) {
            const embed = errorEmbed({
                description: "Please create a VC ban role",
            });
            return await interaction.reply({ embeds: [embed] });
        } else {
            try {
                await target.roles.add(roleId);
                const embed = successEmbed({
                    description: `Banned ${target.toString()} from joining VCs.`,
                });
                return await interaction.reply({ embeds: [embed] });
            } catch (err) {
                console.error(err);
                return await interaction.reply({
                    embeds: [errorEmbed({ description: `${err}` })],
                });
            }
        }
    },
};
