import type { Event } from '#types/Event';
import type { TextChannel } from 'discord.js';

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

    const channel = client.channels.cache.get(process.env['STARBOARD_CHANNEL_ID']) as TextChannel;
    if (!channel) return console.log('Bruh');

    const hooks = await channel.fetchWebhooks();
    const hook = hooks.find(x => x.name == 'Starboard');

    if (!hook) {
      client.starboard = await channel.createWebhook({ name: 'Starboard' });
    } else {
      client.starboard = hook;
    }

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
