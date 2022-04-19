import { Interaction } from 'src/Interaction';
import { ChatInputCommand } from '../ChatInputCommand';
import { CommandOption, CommandOptionType } from './CommandOption';

export class Subcommand
	extends CommandOption
	implements Omit<ChatInputCommand, 'type'>
{
	/**
	 * A subcommand for a {@link CommandGroup}.
	 * @param name the command's name
	 * @param description the command description
	 * @param options arguments for this command
	 * @param onInteraction a method that is called when a user interacts with this command
	 * @param localizations translations for the name and description
	 * @link https://discord.com/developers/docs/interactions/application-commands#slash-commands
	 */
	constructor(
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
			CommandOptionType.SUB_COMMAND,
			name,
			description,
			options,
			false,
			localizations
		);
		this.handleInteraction = onInteraction;
	}

	handleInteraction;
}
