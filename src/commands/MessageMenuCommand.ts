import { Interaction } from 'src/Interaction';
import { Command, CommandType } from './Command';
import { CommandOption } from './options/CommandOption';

export class MessageMenuCommand extends Command {
	/**
	 * A Message Context Menu Command.
	 * @param name the command name
	 * @param options options for this command
	 * @param onInteraction a method that is called when a user interacts with this command
	 * @param [localizations] translations for the command name
	 * @link https://discord.com/developers/docs/interactions/application-commands#message-commands
	 */
	constructor(
		name: string,
		options: CommandOption[],
		onInteraction: (interaction: Interaction) => Promise<void> | void,
		localizations?: { name?: Record<string, string> }
	) {
		super(CommandType.MESSAGE, name, '', options, onInteraction, localizations);
	}
}
