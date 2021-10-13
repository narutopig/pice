import { MessageEmbed } from "discord.js";

interface EmbedOptions {
    title?: string;
    description?: string;
}

export function errorEmbed(options?: EmbedOptions) {
    let title = options && options.title ? options.title : "Error";
    let description =
        options && options.description
            ? options.description
            : "Something bad happened, but the idiot dev forgot to add a message";

    return new MessageEmbed()
        .setColor(0xff0000)
        .setTitle(title)
        .setDescription(description);
}

export function successEmbed(options?: EmbedOptions) {
    let title = options && options.title ? options.title : "Success";
    let description =
        options && options.description
            ? options.description
            : "Something good happened, but the idiot bot dev forgot to add a message";

    return new MessageEmbed()
        .setColor(0x00ff00)
        .setTitle(title)
        .setDescription(description);
}
