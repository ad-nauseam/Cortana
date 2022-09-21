import type { Event } from '#types/Event';

export const event: Event<'interactionCreate'> = {
  name: 'interactionCreate',
  async exec(int) {
    if (int.isChatInputCommand()) {
      const cmd = int.client.commands.get(int.commandName);
      if (!cmd) return console.log(`Unimplimented command registered: ${int.commandName}`);

      try {
        await cmd.exec(int);
      } catch (e) {
        return console.log(e);
      }
    }

    if (int.isModalSubmit()) {
      const modal = int.client.modals.get(int.customId);
      if (!modal) return;

      try {
        await modal.exec(int);
      } catch (e) {
        return console.log(e);
      }
    }
  },
};
