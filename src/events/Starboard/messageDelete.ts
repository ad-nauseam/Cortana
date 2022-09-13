import type { Event } from '#types/Event';

export const event: Event<'messageDelete'> = {
  name: 'messageDelete',

  async exec(message) {
    if (!message.guild) return;

    const deleted = await message.client.db.starboardDelete(message.id);
    if (!deleted) return;

    const starboardChannel = message.guild.channels.cache.get(process.env['STARBOARD_CHANNEL_ID']);
    if (!starboardChannel) return console.log('No starboard ID??');
    if (!starboardChannel.isTextBased()) return console.log('Starboard channel must be text based');

    starboardChannel.messages.delete(deleted.id);
  },
};
