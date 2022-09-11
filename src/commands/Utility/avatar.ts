import { ApplicationCommandOptionType as atype } from 'discord.js';

import type { ChatCommand } from '#types/Command';

export const command: ChatCommand = {
  data: {
    name: 'avatar',
    description: 'Display a users avatar',
    options: [
      {
        name: 'user',
        description: 'User',
        type: atype.User,
      },
    ],
  },

  async exec(int) {
    const user = int.options.getUser('user') || int.user;

    int.reply({
      embeds: [
        {
          title: `${user.tag}'s avatar`,
          image: {
            url: user.displayAvatarURL({ size: 2048 }),
          },
        },
      ],
    });
  },
};
