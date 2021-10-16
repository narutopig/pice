import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { errorEmbed, successEmbed } from "../embeds";
import { hasRoleEmbed } from "./util/general";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban someone")
        .addMentionableOption((option) =>
            option
                .setName("member")
                .setDescription("The user to ban")
                .setRequired(true)
        )
        .addStringOption((option) => {
            return option
                .setName("reason")
                .setDescription("Reason to ban user")
                .setRequired(false);
        }),
    async execute(interaction: CommandInteraction) {
        hasRoleEmbed(interaction, "BAN_MEMBERS");

        try {
            const target = interaction.options.getMentionable(
                "member"
            ) as GuildMember;
            const reason = interaction.options.getString("reason");
            await target.ban({ reason: reason ?? "No reason given." });
            const embed = successEmbed({
                description: `Successfully banned ${target.toString()} ${
                    reason ? `for reason ${reason}` : ""
                }`,
            });
            return await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            const embed = errorEmbed({ description: "Failed to ban user" });
            return await interaction.reply({ embeds: [embed] });
        }
    },
};
