import type { ImageURLOptions } from 'discord.js';
import { ApplicationCommandOptionType as atype } from 'discord.js';

import type { ChatCommand } from '#types/Command';

const imageTypes: string[] = ['webp', 'png', 'jpg', 'jpeg', 'gif'];
const imageSizes: number[] = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

export const command: ChatCommand = {
  data: {
    name: 'avatar',
    description: "Display a user's avatar",
    options: [
      {
        name: 'user',
        description: "The user's avatar to display",
        type: atype.User,
      },
      {
        name: 'format',
        description: 'The type of the avatar image (defaults to webp)',
        type: atype.String,
        choices: imageTypes.map(type => ({ name: type, value: type })),
      },
      {
        name: 'size',
        description: 'The size of the image (defaults to 1024)',
        type: atype.Number,
        choices: imageSizes.map(type => ({ name: type.toString(), value: type })),
      },
      {
        name: 'ephemeral',
        description: 'Hide this message?',
        type: atype.Boolean,
      },
    ],
  },

  async exec(int) {
    const user = int.options.getUser('user') ?? int.user;

    const extension = (int.options.getString('format') ?? 'webp') as ImageURLOptions['extension'];

    const options: ImageURLOptions = {
      forceStatic: extension !== 'gif',
      extension,
      size: int.options.getNumber('size') as ImageURLOptions['size'],
    };

    int.reply({
      embeds: [
        {
          author: { name: user.tag, icon_url: user.displayAvatarURL({ size: 256 }) },
          color: 0x00baf3,
          image: { url: user.displayAvatarURL(options) },
          timestamp: Date.now().toString(),
        },
      ],
      ephemeral: int.options.getBoolean('ephemeral') ?? true,
    });
  },
};
