import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { errorEmbed, successEmbed } from "../embeds";
import { hasRoleEmbed } from "./util/general";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick someone")
        .addMentionableOption((option) =>
            option
                .setName("member")
                .setDescription("The user to kick")
                .setRequired(true)
        )
        .addStringOption((option) => {
            return option
                .setName("reason")
                .setDescription("Reason to kick user")
                .setRequired(false);
        }),
    async execute(interaction: CommandInteraction) {
        hasRoleEmbed(interaction, "KICK_MEMBERS");

        try {
            const target = interaction.options.getMentionable(
                "member"
            ) as GuildMember;
            const reason = interaction.options.getString("reason");
            await target.kick(reason ?? "No reason given.");
            const embed = successEmbed({
                description: `Successfully kicked ${target.toString()} ${
                    reason ? `for reason ${reason}` : ""
                }`,
            });
            return await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            const embed = errorEmbed({
                description: "Failed to kick this user",
            });
            return await interaction.reply({ embeds: [embed] });
        }
    },
};
