import type { Event } from '#types/Event';

export const event: Event<'messageUpdate'> = {
  name: 'messageUpdate',

  async exec(_, newMessage) {
    if (!newMessage.guild) return;

    const exists = await newMessage.client.db.starboardGet(newMessage.id);
    if (!exists) return;

    const starboardChannel = newMessage.guild.channels.cache.get(process.env['STARBOARD_CHANNEL_ID']);
    if (!starboardChannel) return console.log('No starboard ID??');
    if (!starboardChannel.isTextBased()) return console.log('Starboard channel must be text based');

    const starboardEntry = await newMessage.client.starboard.fetchMessage(exists.id);

    newMessage.client.starboard.editMessage(exists.id, {
      content: starboardEntry.content.replace(/\n.+/gs, `\n\n${newMessage.content || ''}`),
      embeds: newMessage.embeds,
      files: newMessage.attachments.map(x => ({ attachment: x.url })),
      allowedMentions: { parse: [] },
    });
  },
};
