import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import discord, { Intents } from "discord.js";
import { config } from "dotenv";
import { db, readFile } from "./firebase";
import { loadCommands, loadData } from "./loader";
import { GuildData } from "./types";

config();

const clientId = process.env.CLIENTID ?? "";
const guildId = process.env.GUILDID ?? "";
const token = process.env.TOKEN ?? "";

const rest = new REST({ version: "9" }).setToken(token);
const client = new discord.Client({ intents: new Intents(32767) }); // Max intents

const commandData = loadData();
const commands = loadCommands();

async function refresh() {
    try {
        await rest.put(Routes.applicationCommands(clientId), {
            body: commandData,
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

client.on("voiceStateUpdate", async (oldState, newState) => {
    // i mean could be undefined but idc
    const data = await readFile(`/guilds/${newState.guild.id}`);
    const roleId = data ? data.vcBanRoleId : "";
    const member = newState.member;
    if (member?.roles.cache.has(roleId)) {
        newState.disconnect();
    }
});

client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand() || !interaction.guild) {
        return;
    }

    const { commandName } = interaction;

    commands.get(commandName)?.execute(interaction);
});

client.on("guildCreate", async (guild) => {
    const data: GuildData = {
        selfroles: [],
        vcBanRoleId: "",
    };
    const doc = db.doc(`/guilds/${guild.id}`);
    const exists = (await doc.get()).exists;
    if (!exists) {
        await db.doc(`/guilds/${guild.id}`).create(data);
    }
});

client.once("ready", () => {
    console.log("Bot started");
    refresh();
});

client.login(token).catch((err) => {
    console.error(err);
    process.exit(1);
});
