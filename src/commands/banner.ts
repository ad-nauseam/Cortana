import type { ImageURLOptions } from 'discord.js';
import { ApplicationCommandOptionType as atype, EmbedBuilder } from 'discord.js';
import type { ChatCommand } from '#types/Command';

const imageTypes: string[] = ['webp', 'png', 'jpg', 'jpeg', 'gif'];
const imageSizes: number[] = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

export const command: ChatCommand = {
  data: {
    name: 'banner',
    description: 'Displays the banner of a user.',
    options: [
      {
        name: 'user',
        description: 'Select a user to display their banner!',
        type: atype.User,
      },
      {
        name: 'format',
        description: 'The type of the banner image (defaults to webp).',
        type: atype.String,
        choices: imageTypes.map(type => ({ name: type, value: type })),
      },
      {
        name: 'size',
        description: 'The size of the image (defaults to 1024).',
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
    await int.client.users.fetch(user, { force: true });
    const ephemeral = int.options.getBoolean('ephemeral') ?? true;
    const extension = (int.options.getString('format') ?? 'webp') as ImageURLOptions['extension'];

    if (!user.bannerURL()) {
      return int.reply({ content: 'This user has no banner', ephemeral });
    }
    const options: ImageURLOptions = {
      forceStatic: extension !== 'gif',
      extension: extension,
      size: int.options.getNumber('size') as ImageURLOptions['size'],
    };

    int.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
          .setColor('Random')
          .setImage(user.bannerURL(options)!)
          .setTimestamp(),
      ],
      ephemeral,
    });
  },
};
