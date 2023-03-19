# MongoDB Repository

This package provides a simple repository pattern implementation for MongoDB using the native MongoDB library for Node.js.

## Installation

To install this package, run the following command:

## Usage

First, create a `Database` instance and connect to your MongoDB database:

Next, create a repository for a specific collection by extending the `BaseRepository` class:

You can then use the repository's methods to interact with the collection. For example, to create a new `Driver` document, you can use the `create()` method:

Similarly, you can use the `read()`, `update()`, and `delete()` methods to retrieve, update, and delete documents in the collection.

Finally, remember to disconnect from the database when you're done:

## License

This package is licensed under the [MIT License](https://opensource.org/licenses/MIT).
