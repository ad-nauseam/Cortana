import { bold, hideLinkEmbed, hyperlink, underscore } from 'discord.js';

import type { ApplicationCommandOptionChoiceData } from 'discord.js';
import type { DocElement, Doc } from 'discordjs-docs-parser';

export function arrayToChoices(x: string[]): ApplicationCommandOptionChoiceData<string>[] {
  return x.map(y => ({ name: y, value: y }));
}

export class DjsDoc {
  private elem: DocElement;

  constructor(elem: DocElement) {
    this.elem = elem;
  }

  extractGenericTypeInfill(type: string): string {
    const match = /<(?<type>[A-Za-z]+)>/.exec(type);
    return match?.groups?.type ?? type;
  }

  formatInheritance(prefix: string, inherits: string[][], doc: Doc): string {
    const res = inherits.flatMap(element => {
      if (Array.isArray(element)) return element.flat(5);
      return [element];
    });

    const inheritedLinks = res.map(element => doc.get(this.extractGenericTypeInfill(element))?.link).filter(Boolean);

    if (!inheritedLinks.length) return '';

    return ` (${prefix} ${inheritedLinks.join(' and ')})`;
  }

  resolveElementString(element: DocElement, doc: Doc): string {
    const parts = [];
    if (element.docType === 'event') parts.push(`${bold('(event)')} `);
    if (element.static) parts.push(`${bold('(static)')} `);
    parts.push(underscore(bold(element.link)));
    if (element.extends) parts.push(this.formatInheritance('extends', element.extends, doc));
    if (element.access === 'private') parts.push(` ${bold('PRIVATE')}`);
    if (element.deprecated) parts.push(` ${bold('DEPRECATED')}`);

    const s = ((element.formattedDescription || element.description) ?? '').split('\n');
    const description = s.length > 1 ? `${s[0]} ${hyperlink('(more...)', hideLinkEmbed(element.url ?? ''))}` : s[0];

    return `${parts.join('')}\n${description}`;
  }

  toString() {
    return this.resolveElementString(this.elem, this.elem.doc);
  }
}
