import { Client, Collection, Partials, IntentsBitField } from 'discord.js';
import { loader } from './util/loader.js';
import { Logger } from './util/logger.js';
import { Piston } from './util/piston.js';
import { DB } from './schemas/db.js';

import type { ChatCommand } from '#types/Command';
import type { Event } from '#types/Event';
import type { Modal } from '#types/Modal';

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace NodeJS {
    export interface ProcessEnv {
      DISCORD_TOKEN: string;
      GUILD_ID: string;
      STARBOARD_CHANNEL_ID: string;
      DB_CONN_STRING: string;
      PISTON_URL: string;
    }
  }
}

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, ChatCommand>;
    modals: Collection<string, Modal>;
    db: DB;
    starboard: Webhook;
    logger: Logger;
    piston: Piston;
  }
}

class ADN extends Client {
  constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
      ],
      partials: [Partials.Reaction, Partials.Message, Partials.User],
    });

    ['DISCORD_TOKEN', 'GUILD_ID', 'STARBOARD_CHANNEL_ID', 'DB_CONN_STRING', 'PISTON_URL'].forEach(x => {
      if (!(x in process.env)) throw new Error(`Environment variable '${x}' not defined`);
    });

    this.commands = new Collection<string, ChatCommand>();
    this.modals = new Collection<string, Modal>();
    this.db = new DB(process.env['DB_CONN_STRING']);
    this.logger = new Logger();
    this.piston = new Piston(process.env['PISTON_URL']);
  }

  init() {
    loader<ChatCommand>('commands', ({ command }) => {
      if (this.commands.has(command.data.name)) throw new Error(`Duplicate command: ${command.data.name}`);
      this.commands.set(command.data.name, command);
    });

    loader<Modal>('modals', ({ modal }) => {
      if (this.modals.has(modal.name)) throw new Error(`Duplicate modal: ${modal.name}`);
      this.modals.set(modal.name, modal);
    });

    loader<Event>('events', ({ event }) => {
      this.on(event.name, event.exec);
    });

    this.login();
  }
}

new ADN().init();
