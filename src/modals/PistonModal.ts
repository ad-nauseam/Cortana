import { TextInputStyle, ComponentType, ModalBuilder, ActionRowBuilder, TextInputBuilder } from 'discord.js';
import { ALLOWED_LANGS } from '../util/constants.js';

import type { Modal } from '#types/Modal';

type Langs = keyof typeof ALLOWED_LANGS;

export const modal: Modal = {
  name: 'piston',
  data: new ModalBuilder()
    .setCustomId('piston')
    .setComponents([
      new ActionRowBuilder<TextInputBuilder>().setComponents([
        new TextInputBuilder().setCustomId('piston').setLabel('Code').setStyle(TextInputStyle.Paragraph),
      ]),
    ]),

  async exec(int) {
    int.deferReply().then(async () => {
      const codeTextInput = int.components[0].components[0];
      if (codeTextInput.type === ComponentType.TextInput) {
        const lang = <Langs>codeTextInput.customId;
        if (lang in ALLOWED_LANGS) {
          const res = await int.client.piston.execute({
            language: lang,
            version: ALLOWED_LANGS[lang],
            files: [
              {
                content: codeTextInput.value,
              },
            ],
          });

          int.editReply({
            content: `\`\`\`${lang}\n${res.run.output}\n${res.compile?.output || ''}\`\`\``,
            files: [{ name: `input.${lang}`, attachment: Buffer.from(codeTextInput.value) }],
          });
        }
      }
    });
  },
};
