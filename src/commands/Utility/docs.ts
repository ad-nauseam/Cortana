import { arrayToChoices, DjsDoc } from '../../util/transform.js';
import { ApplicationCommandOptionType as atype } from 'discord.js';
import { Doc, sources } from 'discordjs-docs-parser';

import type { ChatCommand } from '#types/Command';
import type { SourcesStringUnion, DocElement } from 'discordjs-docs-parser';

export const command: ChatCommand = {
  data: {
    name: 'docs',
    description: 'Documentation commands',
    options: [
      {
        name: 'query',
        description: 'Search term',
        type: atype.String,
        required: true,
      },
      {
        name: 'source',
        description: 'Docs source',
        type: atype.String,
        choices: arrayToChoices(Array.from(sources.keys())),
      },
    ],
  },

  async exec(int) {
    const doc: Doc = await Doc.fetch(<SourcesStringUnion>int.options.getString('source') || 'stable');

    const query = int.options.getString('query', true);
    const res: DocElement[] | null = doc.search(query);
    if (!res) return int.reply({ content: `No results for search: ${query}` });

    const elemString = new DjsDoc(res[0]);

    int.reply({ content: `${elemString}`, flags: 'SuppressEmbeds' });
  },
};
