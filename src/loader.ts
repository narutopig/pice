import { SlashCommandBuilder } from "@discordjs/builders";
import fs from "fs";
import path from "path";
import { Command } from "./types";
import { resolve } from "path";

function getFiles() {
    const cfs = fs
        .readdirSync(resolve(__dirname, "commands/"))
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js")); // Command files
    return cfs;
}
export function loadData(): SlashCommandBuilder[] {
    const cfs = getFiles();

    const res = [];

    for (const cf of cfs) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const c = require(`./commands/${cf}`) as Command;
        res.push(c.data);
    }

    return res;
}

export function loadCommands(): Map<string, Command> {
    const cfs = getFiles();

    const res = new Map<string, Command>();

    for (const cf of cfs) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const c = require(`./commands/${cf}`) as Command;
        res.set(c.data.name, c);
    }

    return res;
}
