module.exports = class Mongodb {
    constructor(url, db_name) {
        this.mongodb = require('mongodb').MongoClient;
        this.url = url || "mongodb://127.0.0.1:27017";
        this.client = new this.mongodb(this.url);
        (async () => await this.client.connect());
        if (!db_name) {
            throw new Error("Database Name must to Initialization.");
        }
        this.db = this.client.db(db_name);
    }

    async db_close() {
        await this.client.close();
    }
}

