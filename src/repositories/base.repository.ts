import { Document, OptionalId } from "mongodb";
import { MongoDBAdapter } from "../adapters/index";

export interface IRepository<T extends Document> {
	create(data: T | OptionalId<T>): Promise<T>;
	read(query: any): Promise<T[]>;
	update(query: any, data: Partial<T>): Promise<any>;
	delete(query: any): Promise<void>;
}

export class BaseRepository<T extends Document> implements IRepository<T> {
	protected adapter: MongoDBAdapter;
	protected collectionName: string;

	constructor(adapter: MongoDBAdapter, collectionName: string) {
		this.adapter = adapter;
		this.collectionName = collectionName;
	}

	async create(data: T): Promise<T> {
		return await this.adapter.create<T>(this.collectionName, data);
	}

	async read(query: any): Promise<T[]> {
		return await this.adapter.read<T>(this.collectionName, query);
	}

	async update(query: any, data: Partial<T>): Promise<any> {
		return await this.adapter.update<T>(this.collectionName, query, data);
	}

	async delete(query: any): Promise<void> {
		await this.adapter.delete(this.collectionName, query);
	}
}
