import type { Event } from '#types/Event';

export const event: Event<'messageDelete'> = {
  name: 'messageDelete',

  async exec(message) {
    if (!message.guild) return;
    if (!message.reactions.cache.has('⭐')) return;

    const deleted = await message.client.db.starboardDelete(message.id);
    if (!deleted.length) return;

    const channel = message.guild.channels.cache.get(process.env['STARBOARD_CHANNEL_ID']);
    if (!channel) return console.log('No starboard ID??');
    if (!channel.isTextBased()) return console.log('Starboard channel must be text based');

    channel.messages.delete(deleted[0].id);
  },
};
