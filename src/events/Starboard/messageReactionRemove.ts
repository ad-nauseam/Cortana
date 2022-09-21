import type { Event } from '#types/Event';

export const event: Event<'messageReactionRemove'> = {
  name: 'messageReactionRemove',

  async exec(reaction) {
    reaction = await reaction.fetch();
    if (reaction.emoji.name !== '⭐') return;

    const starboardChannel = reaction.client.channels.cache.get(process.env.STARBOARD_CHANNEL_ID);
    if (!starboardChannel) return console.log('Invalid Starboard channel');
    if (!starboardChannel.isTextBased()) return console.log('Starboard channel must be text based');

    const exists = await reaction.client.db.starboardGet(reaction.message.id);
    if (!exists) return;

    const content = `⭐ ${reaction.count} ${reaction.message.channel}\n\n${reaction.message.content || ''}`;

    if (reaction.count <= 1) {
      starboardChannel.messages.delete(exists.id);
      await reaction.client.db.starboardDelete(exists.oid);
    } else {
      reaction.client.starboard.editMessage(exists.id, { content });
    }
  },
};
