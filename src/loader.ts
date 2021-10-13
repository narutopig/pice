import { SlashCommandBuilder } from "@discordjs/builders";
import fs from "fs";
import path from "path";
import { Command } from "./types";

export function resolve(fileName: string): string {
    return path.resolve(process.cwd(), fileName);
}

export function loadData(): SlashCommandBuilder[] {
    const cfs = fs
        .readdirSync(resolve("./src/commands/"))
        .filter((file) => file.endsWith(".ts")); // Command files

    const res = [];

    for (const cf of cfs) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const c = require(`./commands/${cf}`) as Command;
        res.push(c.data);
    }

    return res;
}

export function loadCommands(): Map<string, Command> {
    const cfs = fs
        .readdirSync(resolve("./src/commands/"))
        .filter((file) => file.endsWith(".ts")); // Command files

    const res = new Map<string, Command>();

    for (const cf of cfs) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const c = require(`./commands/${cf}`) as Command;
        res.set(c.data.name, c);
    }

    return res;
}
