import type { Event } from '#types/Event';

export const event: Event<'messageReactionRemove'> = {
  name: 'messageReactionRemove',

  async exec(mr) {
    mr = await mr.fetch();
    if (mr.emoji.name !== '⭐') return;

    const channelId = process.env['STARBOARD_CHANNEL_ID'];
    if (!channelId) return console.log('No STARBOARD_CHANNEL_ID!');

    const channel = mr.client.channels.cache.get(channelId);
    if (!channel) return console.log('Invalid Starboard channel');
    if (!channel.isTextBased()) return console.log('Starboard channel must be text based');

    const exists = await mr.client.db.starboardGet(mr.message.id);
    if (!exists) return;

    const content = `⭐ ${mr.count} ${mr.message.channel}\n ${mr.message.content ? `> ${mr.message.content}` : ''}`;

    if (mr.count <= 1) {
      channel.messages.delete(exists.id);
      await mr.client.db.starboardDelete(exists.id);
    } else {
      const webhook = await mr.client.fetchWebhook(
        process.env['STARBOARD_WEBHOOK_ID'],
        process.env['STARBOARD_WEBHOOK_TOKEN'],
      );

      webhook.editMessage(exists.id, { content });
    }
  },
};
