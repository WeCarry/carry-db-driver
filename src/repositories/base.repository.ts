import {
	AnyBulkWriteOperation,
	BulkWriteResult,
	DeleteResult,
	Document,
	Filter,
	FindOneAndDeleteOptions,
	FindOneAndReplaceOptions,
	FindOneAndUpdateOptions,
	FindOptions,
	OptionalId,
	UpdateOptions,
	WithId,
	WithoutId,
} from "mongodb";
import { MongoDBAdapter } from "../adapters/mongodb.adapter";
import Ajv from "ajv";
import ajvFormats from "ajv-formats";

export interface IRepository<T extends Document> {
	create(data: T | OptionalId<T>): Promise<WithId<T>>;
	find(query: Filter<T>, options?: FindOptions<T>): Promise<WithId<T>[]>;
	update(query: Filter<T>, data: Partial<T>): Promise<any>;
	delete(query: Filter<T>): Promise<DeleteResult>;
	deleteMany(query: Filter<T>): Promise<DeleteResult>;
	aggregate(pipeline: object[]): Promise<any[]>;
	countDocuments(query: Filter<Document>): Promise<number>;
	findOne(query: Filter<T>): Promise<WithId<T> | null>;
	findOneAndUpdate(
		query: Filter<T>,
		update: UpdateOptions | Partial<T>,
		options?: FindOneAndUpdateOptions
	): Promise<WithId<T> | null>;
	findOneAndDelete(
		query: Filter<T>,
		options?: FindOneAndDeleteOptions
	): Promise<WithId<T> | null>;
	findOneAndReplace(
		query: Filter<T>,
		replacement: WithoutId<T>,
		options?: FindOneAndReplaceOptions
	): Promise<WithId<T> | null>;
	bulkWrite(operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult>;
}

type Settings = {
	adapter: MongoDBAdapter;
	collection: string;
	schema?: object;
};

export class BaseRepository<T extends Document> implements IRepository<T> {
	protected adapter: MongoDBAdapter;
	protected collection: string;
	protected schema?: object;

	constructor({ adapter, collection, schema }: Settings) {
		this.adapter = adapter;
		this.collection = collection;
		this.schema = schema;
	}

	async create(data: OptionalId<T>): Promise<WithId<T>> {
		this.validate(data);
		return await this.adapter.create<T>(this.collection, data);
	}

	async find(
		query: Filter<T>,
		options?: FindOptions<T>
	): Promise<WithId<T>[]> {
		return await this.adapter.find<T>(this.collection, query, options);
	}

	async update(query: any, data: Partial<T>): Promise<any> {
		this.validate(data);
		return await this.adapter.update<T>(this.collection, query, data);
	}

	async delete(query: any): Promise<DeleteResult> {
		return await this.adapter.delete(this.collection, query);
	}

	async deleteMany(query: Filter<T>): Promise<DeleteResult> {
		return await this.adapter.deleteMany(this.collection, query);
	}

	async aggregate(pipeline: object[]): Promise<any[]> {
		return await this.adapter.aggregate<T>(this.collection, pipeline);
	}

	async countDocuments(query: Filter<Document>): Promise<number> {
		return await this.adapter.countDocuments(this.collection, query);
	}

	async findOne(query: Filter<T>): Promise<WithId<T> | null> {
		return await this.adapter.findOne(this.collection, query);
	}

	async findOneAndUpdate(
		query: Filter<T>,
		update: UpdateOptions | Partial<T>,
		options?: FindOneAndUpdateOptions
	): Promise<WithId<T> | null> {
		return await this.adapter.findOneAndUpdate(
			this.collection,
			query,
			update,
			options
		);
	}

	async findOneAndDelete(
		query: Filter<T>,
		options?: FindOneAndDeleteOptions
	): Promise<WithId<T> | null> {
		return await this.adapter.findOneAndDelete(
			this.collection,
			query,
			options
		);
	}

	async findOneAndReplace(
		query: Filter<T>,
		replacement: WithoutId<T>,
		options?: FindOneAndReplaceOptions
	): Promise<WithId<T> | null> {
		return await this.adapter.findOneAndReplace(
			this.collection,
			query,
			replacement,
			options
		);
	}

	async bulkWrite(
		operations: AnyBulkWriteOperation[]
	): Promise<BulkWriteResult> {
		return await this.adapter.bulkWrite(this.collection, operations);
	}

	protected validate(data: object): void {
		if (this.schema) {
			const ajv = new Ajv({ allErrors: true });
			ajvFormats(ajv);
			const validate = ajv.compile(this.schema);
			const valid = validate(data);

			if (!valid) {
				throw new Error(
					`Schema validation failed: ${ajv.errorsText(
						validate.errors
					)}`
				);
			}
		}
	}
}
