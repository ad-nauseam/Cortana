import type { Event } from '#types/Event';
import type { TextChannel } from 'discord.js';

export const event: Event<'ready'> = {
  name: 'ready',
  async exec(client) {
    const cmds = client.commands.map(x => x.data);
    if (!cmds.length) return console.log('No commands!');

    const guild = client.guilds.cache.get(process.env['GUILD_ID']);
    if (!guild) throw new Error('Invalid GUILD_ID!');

    await guild.commands.set(cmds);

    const channel = <TextChannel>client.channels.cache.get(process.env['STARBOARD_CHANNEL_ID']);
    if (!channel) return console.log('Bruh');

    const hooks = await channel.fetchWebhooks();
    const hook = hooks.find(x => x.name === 'Starboard');

    if (!hook) {
      client.starboard = await channel.createWebhook({ name: 'Starboard' });
    } else {
      client.starboard = hook;
    }

    client.logger.success(`Ready! Logged in as ${client.user.tag}`, true);
    
    const version = await client.db.version()
    
    client.logger.success(`DB ready: ${version}`)
  },
};
