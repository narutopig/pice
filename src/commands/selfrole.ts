import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import {
    listRoles,
    giveRole,
    addRole,
    deleteRole,
    removeRole,
} from "./util/selfrole";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("selfrole")
        .setDescription("Give/create self roles")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("list")
                .setDescription("List all of the self roles")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("give")
                .setDescription("Give yourself a role")
                .addStringOption((option) =>
                    option
                        .setName("roleid")
                        .setDescription("ID of the role")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("Remove a role from yourself")
                .addStringOption((option) =>
                    option
                        .setName("roleid")
                        .setDescription("ID of the role")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Add a role to the self roles list")
                .addStringOption((option) =>
                    option
                        .setName("roleid")
                        .setDescription("ID of the role")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("delete")
                .setDescription("Delete a role from the self roles list")
                .addStringOption((option) =>
                    option
                        .setName("roleid")
                        .setDescription("ID of the role")
                        .setRequired(true)
                )
        ),

    async execute(interaction: CommandInteraction) {
        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case "list":
                listRoles(interaction);
                break;
            case "give":
                giveRole(interaction);
                break;
            case "remove":
                removeRole(interaction);
            case "add":
                addRole(interaction);
                break;
            case "delete":
                deleteRole(interaction);
                break;
        }
    },
};
