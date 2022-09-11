import type { Event } from '#types/Event';

export const event: Event<'messageDeleteBulk'> = {
  name: 'messageDeleteBulk',

  async exec(messages, channel) {
    const cnl = channel.guild.channels.cache.get(process.env['STARBOARD_CHANNEL_ID']);
    if (!cnl) return console.log('No starboard ID??');
    if (!cnl.isTextBased()) return console.log('Starboard channel must be text based');

    const deleted = await channel.client.db.starboardDeleteBulk([...messages.keys()]);
    if (!deleted.length) return;

    cnl.bulkDelete(deleted.map(x => x.id));
  },
};
