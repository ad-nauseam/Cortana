import { ApplicationCommandOptionType as atype } from 'discord.js';

import type { ChatCommand } from '#types/Command';

export const command: ChatCommand = {
  data: {
    name: 'ping',
    description: 'pong',
    options: [
      {
        name: 'ephemeral',
        description: 'Hide this message?',
        type: atype.Boolean,
      },
    ],
  },

  async exec(int) {
    int.reply({
      content: 'Pong!',
      ephemeral: int.options.getBoolean('ephemeral') ?? true,
    });
  },
};
