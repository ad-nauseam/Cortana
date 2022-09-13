import type { Webhook } from 'discord.js';
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
      DB_CONN_STRING: string;
    }
  }
}

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, ChatCommand>;
    db: DB;
    starboard: Webhook;
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

    ['DISCORD_TOKEN', 'GUILD_ID', 'STARBOARD_CHANNEL_ID', 'DB_CONN_STRING'].forEach(x => {
      if (!(x in process.env)) throw new Error(`Environment variable '${x}' not defined`);
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
