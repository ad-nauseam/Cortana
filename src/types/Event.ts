import type { Awaitable, ClientEvents } from 'discord.js';

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  exec: (...args: ClientEvents[K]) => Awaitable<void>;
}
