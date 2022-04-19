import fetch, { Response } from 'node-fetch';

type headers = Record<string, string>;

export class API {
	private queue: Promise<Response>[];
	private remaining: number;
	private resetAt: number;
	private token: string;
	private logger;

	get = this.request.bind(this, 'GET');
	patch = this.request.bind(this, 'PATCH');
	put = this.request.bind(this, 'PUT');
	post = this.request.bind(this, 'POST');
	delete = this.request.bind(this, 'DELETE');

	/**
	 * Allows accessing the Discord API with its ratelimit.
	 * @param token your bot's secret token
	 * @param [logger] a function that is called after each request
	 */
	constructor(
		token: string,
		logger?: (duration: number, response: Response) => Promise<void> | void
	) {
		this.queue = [];
		this.remaining = 1;
		this.resetAt = new Date().valueOf();
		this.token = token;
		this.logger = logger;
	}

	private async request(
		method: string,
		path: string,
		headers: headers = {},
		body?: any
	): Promise<any> {
		let resolve = (_: any) => {};
		this.queue.push(new Promise(r => (resolve = r)));
		await Promise.all([...this.queue.slice(0, -1)]);

		const diff = this.resetAt - new Date().valueOf();
		if (this.remaining < 1 && diff >= 0) {
			await new Promise(r => setTimeout(r, diff));
		}

		const startTime = new Date().valueOf();
		const response = await fetch('https://discord.com/api/v10' + path, {
			method,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${this.token}`,
				...headers,
			},
			body: JSON.stringify(body),
		});
		this.logger?.(new Date().valueOf() - startTime, response);

		this.remaining = parseInt(
			response.headers.get('X-Ratelimit-Remaining') || '1'
		);
		this.resetAt =
			parseFloat(response.headers.get('X-Ratelimit-Reset') || '0') * 1000;

		resolve(0);
		this.queue.splice(0, 1);

		if (response.status === 429) {
			return this.request(method, path, headers, body);
		}

		return response.json();
	}
}
