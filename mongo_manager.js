const db_conn = require('./inc.db_conn');
class MongoManager extends db_conn {
    constructor(url, db_name) {
        super(url, db_name);
        this.operations = {
            insert: "insertOne",
            insert_many: "insertMany",
            find: "find",
            update: "updateOne",
            update_many: "updateMany",
            aggregate: "aggregate",
            count: "countDocuments",
        };
        this.without_spreadoperator = ["insertMany", "aggregate"];
        this.to_array_methods = ["find", "aggregate"];

    }

    async queryRunner(params, query_explain) {
        let output_type_toarray;
        let final_data;
        let query_out = (query_explain === "Y") ? "explain" : "toArray";
        let query_struct = this.db;
        try {
            for (let query_params in params) {
                if (query_params === "operation") {

                    let type = this.operations[params[query_params][0]];

                    output_type_toarray = (this.to_array_methods.includes(type)) ? true : false;
                    let spread_operator = (this.without_spreadoperator.includes(type)) ? false : true;
                    if (spread_operator === true) {
                        query_struct = query_struct[type](...params[query_params][1]);
                    } else {
                        query_struct = query_struct[type](params[query_params][1]);
                    }

                    if (type !== 'find') {
                        break;
                    }

                } else {
                    query_struct = query_struct[query_params](params[query_params]);
                }

            }

            if (output_type_toarray === true) {
                final_data = await query_struct[query_out]();
            }
            else {
                final_data = await query_struct;
            }
            return final_data;
        }
        catch (err) {
            throw err;
        }
        finally {
            query_struct = null;
            final_data = null;
            params = null;
        }
    }

    queryParamsBuilder(collectionName, operation, queryData) {
        if (!this.operations[operation]) {
            throw new Error("Invalid Operation. Possible Operations are: " + Object.keys(this.operations).join(", "));
        }

        if (typeof collectionName !== "string") {
            throw new Error("Collection Name Must be a String.");
        }

        if (typeof operation !== "string") {
            throw new Error("Operation must be a String.");
        }

        if (this.without_spreadoperator.includes(operation)) {
            if (!Array.isArray(queryData)) {
                throw new Error("Query data must be an Array.");
            }
        } else {
            if (typeof queryData !== "object") {
                throw new Error("Query data must be an Object.");
            }
            queryData = [queryData];
        }

        return {
            collection: collectionName,
            operation: [operation, queryData],
        };
    }
}
module.exports = MongoManager;