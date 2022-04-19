export type JSONValue =
	| string
	| number
	| boolean
	| undefined //if the property doesn't exist
	| null
	| JSONObject
	| JSONValue[];

export type JSONObject = { [key: string]: JSONValue };

export abstract class JSONExportable {
	/**
	 * A class that can be converted to JSON.
	 */
	constructor() {}

	/**
	 * Generates an object for sending to the Discord API.
	 * @returns the object
	 */
	abstract toJSON(): JSONValue;
}
