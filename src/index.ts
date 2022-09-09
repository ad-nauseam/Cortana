import { Client, Collection } from 'discord.js';
import { loader } from './util/loader.js';

import type { ChatCommand } from '#types/Command';
import type { Event } from '#types/Event';

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace NodeJS {
    export interface ProcessEnv {
      DISCORD_TOKEN: string;
      GUILD_ID: string;
    }
  }
}

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, ChatCommand>;
  }
}

class ADN extends Client {
  constructor() {
    super({ intents: ['Guilds'] });

    this.commands = new Collection<string, ChatCommand>();
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
