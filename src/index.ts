import { Client, Collection, Partials, IntentsBitField } from 'discord.js';
import { loader } from './util/loader.js';
import { DB } from './schemas/db.js';

import type { ChatCommand } from '#types/Command';
import type { Event } from '#types/Event';

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace NodeJS {
    export interface ProcessEnv {
      DISCORD_TOKEN: string;
      GUILD_ID: string;
      STARBOARD_CHANNEL_ID: string;
      STARBOARD_WEBHOOK_ID: string;
      STARBOARD_WEBHOOK_TOKEN: string;
      DB_CONN_STRING: string;
    }
  }
}

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, ChatCommand>;
    /* eslint-disable @typescript-eslint/ban-types */
    db: DB;
  }
}

class ADN extends Client {
  constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions
      ],
      partials: [Partials.Reaction, Partials.Message],
    });

    this.commands = new Collection<string, ChatCommand>();
    this.db = new DB(process.env['DB_CONN_STRING']);
  }

  init() {
    loader<ChatCommand>('commands', ({ command }) => {
      if (this.commands.has(command.data.name)) throw new Error(`Duplicate command: ${command.data.name}`);
      this.commands.set(command.data.name, command);
    });

    loader<Event>('events', ({ event }) => {
      this.on(event.name, event.exec);
    });

    this.login();
  }
}

new ADN().init();
