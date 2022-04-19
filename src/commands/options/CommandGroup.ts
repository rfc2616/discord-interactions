import { CommandOption, CommandOptionType } from './CommandOption';
import { Subcommand } from './Subcommand';

export class CommandGroup extends CommandOption {
	/**
	 * A Command Group containing other commands.
	 * @param name the group's name
	 * @param description a description for this command group
	 * @param subCommands a list of subcommands
	 * @param localizations translations for the name and description
	 * @link https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups
	 */
	constructor(
		name: string,
		description: string,
		subCommands: Subcommand[],
		localizations?: { name?: Record<string, string> }
	) {
		super(
			CommandOptionType.SUB_COMMAND_GROUP,
			name,
			description,
			subCommands,
			undefined,
			localizations
		);
	}

	/**
	 * Adds commands to the command group.
	 * @param commands the commands to add
	 * @returns the command group
	 */
	add(...commands: Subcommand[]) {
		this.options.push(...commands);
		return this;
	}
}
