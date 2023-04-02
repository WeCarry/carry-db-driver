# My Database Package

This package provides an easy-to-use interface for working with MongoDB. It includes a database connection manager, an adapter for MongoDB operations, a base repository for schema validation, and custom repositories for your data models.

## Table of Contents

- Installation
- Usage
  - Database Configuration and Connection
  - Creating a Repository
  - Performing CRUD Operations
  - Using Schema Validation
- API Reference
  - Database
  - MongoDBAdapter
  - BaseRepository

## Installation

To install this package, use the following command:

`npm install carry-db-driver`

## Usage

### Database Configuration and Connection

First, import the `Database` class from the package and create a new instance with your MongoDB connection settings:

```
import { Database } from "carry-db-driver";

const database = new Database({
  url: "mongodb://localhost:27017",
  dbName: "myDatabase",
});

await database.connect();

```

Don't forget to call `disconnect()` when you're done using the database:

### Creating a Repository

To create a custom repository, extend the `BaseRepository` class and provide the necessary settings, including the `adapter`, `collection`, and optional `schema`. Here's an example of a `UserRepository`:

```
import { BaseRepository } from "carry-db-driver";

class UserRepository extends BaseRepository<User> {
  constructor(adapter: MongoDBAdapter) {
    super({ adapter, collection: "users", schema: userSchema });
  }
}

```

### Performing CRUD Operations

You can use the methods provided by the custom repository to perform CRUD operations on the database. For example:

```
const userRepository = new UserRepository(database.getAdapter());

const user: User = {
  name: "John Doe",
  email: "john.doe@example.com",
  age: 30,
};

const createdUser = await userRepository.create(user);

```

### Using Schema Validation

To validate your data against a JSON schema, provide the schema when creating your custom repository. Here's an example schema for the `User` model:

```
const userSchema = {
  type: "object",
  properties: {
    _id: { type: "string", format: "objectId" },
    name: { type: "string", minLength: 1, maxLength: 50 },
    email: { type: "string", format: "email" },
    age: { type: "integer", minimum: 1, maximum: 120 },
  },
  required: ["name", "email"],
  additionalProperties: false,
};

```

When you perform CRUD operations with your repository, the data will be validated against the schema before being sent to the database.

## API Reference

### Database

The `Database` class is responsible for managing the connection to MongoDB.

#### Methods

- `connect(): Promise<void>`: Connects to the MongoDB server.
- `disconnect(): Promise<void>`: Disconnects from the MongoDB server.
- `getAdapter(): MongoDBAdapter`: Returns the MongoDB adapter instance.

### MongoDBAdapter

The `MongoDBAdapter` class provides methods for performing MongoDB operations.

#### Methods

- `create<T extends Document>(collectionName: string, data: OptionalId<T>): Promise<WithId<T>>`: Inserts a new document into the specified collection.
- ` find<T extends Document>````(collectionName: string, query: Filter<T>``, options?: FindOptions<T>``): Promise<WithId<T>``[]> `: Finds documents in the specified collection that match the query.
- `update<T extends Document>(collectionName: string, query: Filter<T>, data: UpdateOptions | Partial<T>): Promise<any>`: Updates a document in the specified collection that matches the query.
- `delete<T>(collectionName: string, query: Filter<T>): Promise<DeleteResult>`: Deletes a document in the specified collection that matches the query.
- `deleteMany<T>(collectionName: string, query: Filter<T>): Promise<DeleteResult>`: Deletes multiple documents in the specified collection that match the query.
- `aggregate<T extends Document>(collection: string, pipeline: object[]): Promise<T[]>`: Performs an aggregation pipeline on the specified collection.
- `countDocuments<T extends Document>(collection: string, query: Filter<T>): Promise<number>`: Counts the number of documents in the specified collection that match the query.
- `findOne<T extends Document>(collection: string, query: Filter<T>): Promise<WithId<T> | null>`: Finds one document in the specified collection that matches the query.
- `findOneAndUpdate<T extends Document>(collection: string, query: Filter<T>, update: UpdateOptions | Partial<T>, options?: FindOneAndUpdateOptions): Promise<WithId<T> | null>`: Finds a document in the specified collection that matches the query and updates it.
- `findOneAndDelete<T extends Document>(collection: string, query: Filter<T>, options?: FindOneAndDeleteOptions): Promise<WithId<T> | null>`: Finds a document in the specified collection that matches the query and deletes it.
- `findOneAndReplace<T extends Document>(collection: string, query: Filter<T>, replacement: WithoutId<T>, options?: FindOneAndReplaceOptions): Promise<WithId<T> | null>`: Finds a document in the specified collection that matches the query and replaces it.
- `bulkWrite(collection: string, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult>`: Performs multiple write operations in the specified collection.

### BaseRepository

The `BaseRepository` class is a generic repository that provides basic CRUD operations and schema validation.

#### Methods

- `create(data: OptionalId<T>): Promise<WithId<T>>`: Inserts a new document into the specified collection.
- `find(query: Filter<T>, options?: FindOptions<T>): Promise<WithId<T>[]>`: Finds documents in the specified collection that match the query.
- `update(query: any, data: Partial<T>): Promise<any>`: Updates a document in the specified collection that matches the query.
- `delete(query: any): Promise<DeleteResult>`: Deletes a document in the specified collection that matches the query.
- `deleteMany(query: Filter<T>): Promise<DeleteResult>`: Deletes multiple documents in the specified collection that match the query.
- `aggregate(pipeline: object[]): Promise<any[]>`: Performs an aggregation pipeline on the specified collection.
- `countDocuments(query: Filter<Document>): Promise<number>`: Counts the number of documents in the specified collection that match the query.
- `findOne(query: Filter<T>): Promise<WithId<T> | null>`: Finds one document in the specified collection that matches the query.
- `findOneAndUpdate(query: Filter<T>, update: UpdateOptions | Partial<T>, options?: FindOneAndUpdateOptions): Promise<WithId<T> | null>`: Finds a document in the specified collection that matches the query and updates it.
- `findOneAndDelete(query: Filter<T>, options?: FindOneAndDeleteOptions): Promise<WithId<T> | null>`: Finds a document in the specified collection that matches the query and deletes it.
