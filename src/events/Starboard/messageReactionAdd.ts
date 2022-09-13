import type { MessageActionRowComponentBuilder } from 'discord.js';
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

import type { Event } from '#types/Event';

export const event: Event<'messageReactionAdd'> = {
  name: 'messageReactionAdd',
  async exec(reaction) {
    reaction = await reaction.fetch();
    if (!reaction.count) return;
    if (reaction.emoji.name === '⭐' && reaction.count >= 2) {
      const starboardChannel = reaction.client.channels.cache.get(process.env['STARBOARD_CHANNEL_ID']);
      if (!starboardChannel) return console.log('Invalid Starboard channel');
      if (!starboardChannel.isTextBased()) return console.log('Starboard channel must be text based');

      const content = `⭐ ${reaction.count} ${reaction.message.channel}\n\n${reaction.message.content || ''}`;
      const exists = await reaction.client.db.starboardGet(reaction.message.id);
      if (!exists) {
        const nm = await reaction.client.starboard.send({
          username: reaction.message.author?.username || '',
          avatarURL: reaction.message.author?.displayAvatarURL(),
          content,
          embeds: reaction.message.embeds,
          files: reaction.message.attachments.map(x => ({ attachment: x.url })),
          components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
              new ButtonBuilder().setLabel('Jump').setStyle(ButtonStyle.Link).setURL(reaction.message.url),
            ),
          ],
          allowedMentions: { parse: [] },
        });

        await reaction.client.db.starboardAdd(nm.id, reaction.message.id);
      } else {
        reaction.client.starboard.editMessage(exists.id, { content });
      }
    }
  },
};
