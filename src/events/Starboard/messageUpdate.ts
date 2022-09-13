import type { Event } from '#types/Event';

export const event: Event<'messageUpdate'> = {
  name: 'messageUpdate',

  async exec(om, nm) {
    if (!nm.guild) return;

    const exists = await nm.client.db.starboardGet(nm.id);
    if (!exists) return;

    const channel = nm.guild.channels.cache.get(process.env['STARBOARD_CHANNEL_ID']);
    if (!channel) return console.log('No starboard ID??');
    if (!channel.isTextBased()) return console.log('Starboard channel must be text based');

    const msg = await nm.client.starboard.fetchMessage(exists.id);

    nm.client.starboard.editMessage(exists.id, {
      content: msg.content.replace(/\n.+/gs, `\n\n${nm.content || ''}`),
      embeds: nm.embeds,
      files: nm.attachments.map(x => ({ attachment: x.url })),
      allowedMentions: { parse: [] },
    });
  },
};
