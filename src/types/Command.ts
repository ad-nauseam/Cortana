import type {
  ApplicationCommandPermissions,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ApplicationCommandData,
} from 'discord.js';

// I'm not gonna worry about this for now, but this doesn't exactly check the types properly (i.e. if permissions is in the object, it doesn't care about guildIds)
export type ChatCommand = BaseChatCommand | GuildChatCommand;

export interface GuildChatCommand extends BaseChatCommand {
  guildIds: string[];
  permissions: ApplicationCommandPermissions[];
}

export interface BaseChatCommand {
  data: ApplicationCommandData;
  exec: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<unknown>;
}
