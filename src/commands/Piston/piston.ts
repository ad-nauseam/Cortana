import { arrayToChoices } from '../../util/transform.js';
import { ALLOWED_LANGS } from '../../util/constants.js';

import { ApplicationCommandOptionType as atype } from 'discord.js';
import type { ChatCommand } from '#types/Command';

export const command: ChatCommand = {
  data: {
    name: 'piston',
    description: 'Run code!',
    options: [
      {
        name: 'language',
        description: 'language',
        type: atype.String,
        choices: arrayToChoices(Object.keys(ALLOWED_LANGS)),
        required: true,
      },
    ],
  },

  async exec(int) {
    const language = int.options.getString('language', true);
    const modal = int.client.modals.get('piston');
    if (!modal) return;

    modal.data.components[0].components[0].setCustomId(language);
    modal.data.setTitle(`Execute ${language} code`);

    return int.showModal(modal.data);
  },
};
