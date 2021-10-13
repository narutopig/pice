import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import discord, { Intents } from "discord.js";
import { config } from "dotenv";
import { readFile } from "./firebase";
import { loadCommands, loadData } from "./loader";

config();

const clientId = process.env.CLIENTID ?? "";
const guildId = process.env.GUILDID ?? "";
const token = process.env.TOKEN ?? "";

const rest = new REST({ version: "9" }).setToken(token);
const client = new discord.Client({ intents: [Intents.FLAGS.GUILDS] }); // Max intents

const commandData = loadData();
const commands = loadCommands();

async function refresh() {
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandData,
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

client.on("voiceStateUpdate", async (oldState, newState) => {
    // i mean could be undefined but idc
    const data = await readFile(`/selfroles/${newState.guild.id}`);
    const roleId = data ? data.vcBanRoleId : "";
    const member = newState.member;
    if (member?.roles.cache.has(roleId)) {
        newState.disconnect();
    }
});

client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const { commandName } = interaction;

    commands.get(commandName)?.execute(interaction);
});

client.once("ready", () => {
    console.log("Bot started");
    refresh();
});

client.login(token).catch((err) => {
    console.error(err);
    process.exit(1);
});
