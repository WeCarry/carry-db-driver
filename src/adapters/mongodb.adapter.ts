import { MongoClient, Collection, Db, Document, ObjectId } from 'mongodb';

class MongoDBAdapter {
    private client: MongoClient;
    private db: Db;

    constructor(client: MongoClient, databaseName: string) {
        this.client = client;
        this.db = this.client.db(databaseName);
    }

    private getCollection(collectionName: string): Collection {
        return this.db.collection(collectionName);
    }

    async create<T extends Document>(collectionName: string, data: T): Promise<T> {
        const collection = this.getCollection(collectionName);
        const result = await collection.insertOne(data);
        const insertedId = result.insertedId as ObjectId;
        const insertedDocument = (await collection.findOne({ _id: insertedId })) as unknown as T;
        return insertedDocument;
    }

    async read<T extends Document>(collectionName: string, query: any): Promise<T[]> {
        const collection = this.getCollection(collectionName);
        return await collection.find<T>(query).toArray();
    }

    async update<T extends Document>(
        collectionName: string,
        query: any,
        data: Partial<T>
    ): Promise<any> {
        const collection = this.getCollection(collectionName);
        const result = await collection.updateOne(query, { $set: data });
        return result;
    }

    async delete(collectionName: string, query: any): Promise<void> {
        const collection = this.getCollection(collectionName);
        await collection.deleteOne(query);
    }
}

export default MongoDBAdapter;
