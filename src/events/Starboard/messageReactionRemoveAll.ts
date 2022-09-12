import type { Event } from '#types/Event';

export const event: Event<'messageReactionRemoveAll'> = {
  name: 'messageReactionRemoveAll',

  async exec(message) {

    const channelId = process.env['STARBOARD_CHANNEL_ID'];
    if (!channelId) return console.log('No STARBOARD_CHANNEL_ID!');

    const channel = message.client.channels.cache.get(channelId);
    if (!channel) return console.log('Invalid Starboard channel');
    if (!channel.isTextBased()) return console.log('Starboard channel must be text based');

    const exists = await message.client.db.starboardDelete(message.id);
    if (!exists) return;

    channel.messages.delete(exists.id);
  },
};
