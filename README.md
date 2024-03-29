# MongoDB Manager

MongoDB Manager is a lightweight JavaScript library designed to simplify interactions with MongoDB databases. It provides a high-level abstraction for common database operations, making it easier for developers to work with MongoDB in their Node.js applications.

## Features

- **Simplified API**: Abstracts away the complexity of MongoDB operations, providing a straightforward interface for database interactions.
- **Error Handling**: Robust error handling mechanisms ensure that errors are caught and handled gracefully, providing informative error messages for debugging.
- **Lazy Connection**: Establishes connections to the MongoDB server only when required, optimizing resource usage.
- **Parameter Validation**: Validates input parameters to ensure data integrity and prevent common errors.
- **Consistent Result Formatting**: Ensures that query results are always returned as arrays, simplifying downstream data processing.

## Installation

Install MongoDB Manager via npm:

```bash
npm install mongodb-manager
```


## Usage

```javascript
const { MongoManager } = require('mongodb-manager');



(async function () {
    try {
        // Initialize MongoDB Manager with MongoDB URL and database name
        const mongoManager = new MongoManager(process.env.DB_URL, process.env.DB_NAME);
        // Build query parameters
        let params = mongoManager.queryParamsBuilder("app_user_data", "find", { id: "1234" });

        // Execute the query
        let data = await mongoManager.queryRunner(params);

        // Output the result
        console.log('Data:', data);
    } catch (error) {
        console.error(error.message);
    } finally {
        // Close the MongoDB connection
        await mongoManager.db.close();
    }
})();

```
