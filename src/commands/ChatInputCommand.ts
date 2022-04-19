import { JSONObject } from 'src/base/JSON';
import { Interaction } from 'src/Interaction';
import { Command, CommandType } from './Command';
import { CommandOption } from './options/CommandOption';

export class ChatInputCommand extends Command {
	/**
	 * A Chat Input Command.
	 * @param name the command name
	 * @param description the command description
	 * @param options options for this command
	 * @param onInteraction a method that is called when a user interacts with this command
	 * @param {localizations} translations for the command name and description
	 * @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
	 */
	public constructor(
		name: string,
		description: string,
		options: CommandOption[],
		onInteraction: (interaction: Interaction) => Promise<void> | void,
		localizations?: {
			name?: Record<string, string>;
			description?: Record<string, string>;
		}
	) {
		super(
			CommandType.CHAT_INPUT,
			name,
			description,
			options,
			onInteraction,
			localizations
		);
	}
}
