import type { MessageActionRowComponentBuilder } from 'discord.js';
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

import type { Event } from '#types/Event';

export const event: Event<'messageReactionAdd'> = {
  name: 'messageReactionAdd',
  async exec(mr) {
    mr = await mr.fetch();
    if (!mr.count) return;
    if (mr.emoji.name == '⭐' && mr.count >= 2) {
      const channelId = process.env['STARBOARD_CHANNEL_ID'];
      if (!channelId) return console.log('No STARBOARD_CHANNEL_ID!');

      const channel = mr.client.channels.cache.get(channelId);
      if (!channel) return console.log('Invalid Starboard channel');
      if (!channel.isTextBased()) return console.log('Starboard channel must be text based');

      const content = `⭐ ${mr.count} ${mr.message.channel}\n\n${mr.message.content || ''}`;
      const exists = await mr.client.db.starboardGet(mr.message.id);
      if (!exists) {
        const nm = await mr.client.starboard.send({
          username: mr.message.author?.username || '',
          avatarURL: mr.message.author?.displayAvatarURL(),
          content,
          embeds: mr.message.embeds,
          files: mr.message.attachments.map(x => ({ attachment: x.url })),
          components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
              new ButtonBuilder().setLabel('Jump').setStyle(ButtonStyle.Link).setURL(mr.message.url),
            ),
          ],
          allowedMentions: { parse: [] },
        });

        await mr.client.db.starboardAdd(nm.id, mr.message.id);
      } else {
        mr.client.starboard.editMessage(exists.id, { content });
      }
    }
  },
};
