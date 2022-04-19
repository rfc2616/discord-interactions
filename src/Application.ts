import {
	Snowflake,
	RESTGetAPICurrentUserResult,
	APIBaseInteraction,
} from 'discord-api-types/v10';
import { createServer, ServerResponse } from 'http';
import nacl from 'tweetnacl';
import { Command, CommandType } from './commands/Command';
import { CommandGroup } from './commands/options/CommandGroup';
import { API } from './networking/API';

export class Application {
	private api;
	private PUBLIC_KEY;
	private options;
	private commands: Array<Command | CommandGroup>;

	constructor(
		api: API,
		PUBLIC_KEY: string,
		options?: { devModeEnabled?: boolean; devGuilds?: Snowflake[] }
	) {
		this.api = api;
		this.PUBLIC_KEY = PUBLIC_KEY;
		this.options = options;
		this.commands = [];
	}

	add(...commands: (Command | CommandGroup)[]): Application {
		for (let c of commands) {
			if (c instanceof CommandGroup) {
				c = c as unknown as Command;
				c.type = CommandType.CHAT_INPUT; //TODO: find a better way to do this
			}

			this.commands.push(c);
		}

		return this;
	}

	async listen(port: number) {
		await this.applyCommands();
		console.log('updated commands');

		const server = createServer(async (req, res) => {
			const buffers = [];
			for await (const chunk of req) {
				buffers.push(chunk);
			}
			const body = Buffer.concat(buffers).toString();

			const signature = req.headers['x-signature-ed25519'];
			const timestamp = req.headers['x-signature-timestamp'];

			try {
				const isVerified = nacl.sign.detached.verify(
					Buffer.from(timestamp + body),
					Buffer.from(typeof signature === 'string' ? signature : '', 'hex'),
					Buffer.from(this.PUBLIC_KEY, 'hex')
				);
				if (!isVerified) throw new Error();
			} catch {
				res.statusCode = 401;
				res.end();
				return;
			}

			let interaction;
			try {
				interaction = JSON.parse(body);
			} catch (e) {
				res.statusCode = 400;
				if (e instanceof SyntaxError) res.write(e.message);
				res.end();
				return;
			}

			await this.handleInteraction(res, interaction);
		});

		server.listen(port, '0.0.0.0');
		console.log(`listening for interactions on :${port}`);
	}

	private async applyCommands() {
		const { id: applicationID } = (await this.api.get(
			'/users/@me'
		)) as RESTGetAPICurrentUserResult;
		const commandData = JSON.stringify(this.commands.map(c => c.toJSON()));

		if (!this.options?.devModeEnabled) {
			await this.api.put(`/applications/{id}/commands`, {}, commandData);
			return;
		}

		if (!this.options.devGuilds || this.options.devGuilds.length === 0) {
			throw new Error(
				'You have to provide at least one devGuild when devMode is enabled'
			);
		}

		for (const guildID of this.options?.devGuilds) {
			await this.api.put(
				`/applications/${applicationID}/guilds/${guildID}/commands`,
				{},
				commandData
			);
			return;
		}
	}

	private async handleInteraction(
		res: ServerResponse,
		interaction: APIBaseInteraction<number, any>
	) {
		function respondWith(type: number, data: any) {
			res.write(JSON.stringify({ type, data }));
			res.setHeader('Content-Type', 'application/json');
			res.end();
		}
	}
}
