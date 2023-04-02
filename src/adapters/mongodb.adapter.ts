import {
	MongoClient,
	Collection,
	Db,
	Document,
	ObjectId,
	AggregationCursor,
	OptionalId,
	Filter,
	UpdateOptions,
	FindOneAndUpdateOptions,
	FindOneAndDeleteOptions,
	FindOneAndReplaceOptions,
	WithId,
	WithoutId,
	FindOperators,
	FindOptions,
	DeleteResult,
	AnyBulkWriteOperation,
	BulkWriteResult,
} from "mongodb";

export class MongoDBAdapter {
	private client: MongoClient;
	private db: Db;

	constructor(client: MongoClient, databaseName: string) {
		this.client = client;
		this.db = this.client.db(databaseName);
	}
	async create<T extends Document>(
		collectionName: string,
		data: OptionalId<T>
	): Promise<WithId<T>> {
		const collection = this.getCollection(collectionName);
		const result = await collection.insertOne(data);
		const insertedId = result.insertedId as ObjectId;
		const insertedDocument = (await collection.findOne({
			_id: insertedId,
		})) as unknown as WithId<T>;
		return insertedDocument;
	}

	async find<T extends Document>(
		collectionName: string,
		query: Filter<T>,
		options?: FindOptions<T>
	): Promise<WithId<T>[]> {
		const collection = this.getCollection(collectionName);
		return await collection
			.find<WithId<T>>(query as Filter<WithId<Document>>, options)
			.toArray();
	}

	async update<T extends Document>(
		collectionName: string,
		query: Filter<T>,
		data: UpdateOptions | Partial<T>
	): Promise<any> {
		const collection = this.getCollection(collectionName);
		const result = await collection.updateOne(
			query as Filter<WithId<Document>>,
			{ $set: data }
		);
		return result;
	}

	async delete<T>(
		collectionName: string,
		query: Filter<T>
	): Promise<DeleteResult> {
		const collection = this.getCollection(collectionName);
		return await collection.deleteOne(query as Filter<Document>);
	}

	async deleteMany<T>(
		collectionName: string,
		query: Filter<T>
	): Promise<DeleteResult> {
		const collection = this.getCollection(collectionName);
		return await collection.deleteMany(query as Filter<Document>);
	}

	async aggregate<T extends Document>(
		collection: string,
		pipeline: object[]
	): Promise<T[]> {
		const cursor: AggregationCursor<T> = this.db
			.collection<T>(collection)
			.aggregate(pipeline);
		return await cursor.toArray();
	}

	getCollection<T extends Document>(collection: string): Collection<T> {
		return this.db.collection<T>(collection);
	}

	async countDocuments<T extends Document>(
		collection: string,
		query: Filter<T>
	): Promise<number> {
		return await this.db.collection<T>(collection).countDocuments(query);
	}

	async findOne<T extends Document>(
		collection: string,
		query: Filter<T>
	): Promise<WithId<T> | null> {
		return await this.db.collection<T>(collection).findOne(query);
	}

	async findOneAndUpdate<T extends Document>(
		collection: string,
		query: Filter<T>,
		update: UpdateOptions | Partial<T>,
		options?: FindOneAndUpdateOptions
	): Promise<WithId<T> | null> {
		const result = await this.db
			.collection<T>(collection)
			.findOneAndUpdate(query, update, options);
		return result.value;
	}

	async findOneAndDelete<T extends Document>(
		collection: string,
		query: Filter<T>,
		options?: FindOneAndDeleteOptions
	): Promise<WithId<T> | null> {
		const result = await this.db
			.collection<T>(collection)
			.findOneAndDelete(query, options);
		return result.value;
	}

	async findOneAndReplace<T extends Document>(
		collection: string,
		query: Filter<T>,
		replacement: WithoutId<T>,
		options?: FindOneAndReplaceOptions
	): Promise<WithId<T> | null> {
		const result = await this.db
			.collection<T>(collection)
			.findOneAndReplace(query, replacement, options);
		return result.value;
	}

	async bulkWrite(collection: string, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult> {
		const result = await this.db.collection(collection).bulkWrite(operations);
		return result;
	}
}
