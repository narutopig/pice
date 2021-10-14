import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("github")
        .setDescription("Github repo for the bot"),
    async execute(interaction: CommandInteraction) {
        return await interaction.reply(
            "Here is the Github link: https://github.com/narutopig/pice"
        );
    },
};
