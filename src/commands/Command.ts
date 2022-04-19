import { JSONExportable, JSONObject } from 'src/base/JSON';
import { CommandOption } from './options/CommandOption';
import { Interaction } from '../Interaction';

export class Command extends JSONExportable {
	private type;
	private name;
	private description: string;
	private options;
	private localizations;

	/**
	 * A basic Application Command.
	 * @param type the command type
	 * @param name the command name
	 * @param description the command description
	 * @param options options for this command
	 * @param onInteraction a method that is called when a user interacts with this command
	 * @param {localizations} translations for the command name and description
	 * @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
	 */
	public constructor(
		type: CommandType,
		name: string,
		description: string,
		options: CommandOption[],
		onInteraction: (interaction: Interaction) => Promise<void> | void,
		localizations?: {
			name?: Record<string, string>;
			description?: Record<string, string>;
		}
	) {
		super();

		this.type = type;
		this.name = name;
		this.description = description;
		this.options = options;
		this.localizations = localizations;
		this.handleInteraction = onInteraction;
	}

	public handleInteraction;

	public toJSON = (): JSONObject => ({
		type: this.type,
		name: this.name,
		name_localizations: this.localizations?.name,
		description: this.description,
		description_localizations: this.localizations?.description,
		options: this.options.map(o => o.toJSON()),
	});
}

/**
 * An Application Command type.
 * @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
 */
export enum CommandType {
	CHAT_INPUT = 1,
	USER,
	MESSAGE,
}
