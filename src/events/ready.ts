import type { Event } from '#types/Event';
import type { Collection } from "discord.js"
import type { GuildChatCommand } from '#types/Command';

export const event: Event<'ready'> = {
  name: 'ready',
  async exec(client) {
    const cmds = client.commands.map(x => x.data);
    if (!cmds) return console.log('No commands!');

    const guildID = process.env.GUILD_ID;
    if (!guildID) throw new Error('No GUILD_ID set!');

    const guild = client.guilds.cache.get(guildID);
    if (!guild) throw new Error('Invalid GUILD_ID!');

    await guild.commands.set(cmds);

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
