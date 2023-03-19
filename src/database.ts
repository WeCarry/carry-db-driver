import { MongoClient, MongoClientOptions } from "mongodb";
import { MongoDBAdapter } from "./adapters/mongodb.adapter";

export interface DatabaseConfig {
	url: string;
	dbName: string;
	options?: MongoClientOptions;
}

export class Database {
	private config: DatabaseConfig;
	private client: MongoClient | null;
	private adapter: MongoDBAdapter | null;

	constructor(config: DatabaseConfig) {
		this.config = config;
		this.client = null;
		this.adapter = null;
	}

	async connect(): Promise<void> {
		if (!this.client) {
			this.client = new MongoClient(this.config.url, this.config.options);
			await this.client.connect();
		}

		if (!this.adapter) {
			this.adapter = new MongoDBAdapter(this.client, this.config.dbName);
		}
	}

	async disconnect(): Promise<void> {
		if (this.client) {
			await this.client.close();
			this.client = null;
			this.adapter = null;
		}
	}

	getAdapter(): MongoDBAdapter {
		if (!this.adapter) {
			throw new Error(
				"Database not connected. Call connect() before using the adapter."
			);
		}
		return this.adapter;
	}
}
