import { JSONExportable, JSONObject } from 'src/base/JSON';

export class CommandOption implements JSONExportable {
	type;
	name;
	description;
	options;
	required;
	localizations;

	/**
	 * A Command option for {@link ChatInputCommand}.
	 * @param type the option type
	 * @param name the option name
	 * @param description the option description
	 * @param options options inside this option (applies to {@link CommandGroup} and {@link Subcommand})
	 * @param required whether this option is required for executing the command
	 * @param [localizations] translation for the name and description
	 * @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
	 */
	constructor(
		type: CommandOptionType,
		name: string,
		description: string,
		options: CommandOption[],
		required?: boolean,
		localizations?: {
			name?: Record<string, string>;
			description?: Record<string, string>;
		}
	) {
		this.type = type;
		this.name = name;
		this.description = description;
		this.options = options;
		this.required = required;
		this.localizations = localizations;
	}

	toJSON(): JSONObject {
		return {
			type: this.type,
			name: this.name,
			name_localizations: this.localizations?.name,
			description: this.description,
			description_localizations: this.localizations?.description,
			required: this.required,
			options: this.options.map(o => o.toJSON()),
		};
	}
}

/**
 * An Command Option Type.
 * @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
 */
export enum CommandOptionType {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP,
	STRING,
	INTEGER,
	BOOLEAN,
	USER,
	CHANNEL,
	ROLE,
	MENTIONABLE,
	NUMBER,
	ATTACHMENT,
}
