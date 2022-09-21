import type { ModalBuilder, ModalSubmitInteraction } from 'discord.js';

export interface Modal {
  name: string;
  data: ModalBuilder;
  exec: (int: ModalSubmitInteraction) => void;
}
