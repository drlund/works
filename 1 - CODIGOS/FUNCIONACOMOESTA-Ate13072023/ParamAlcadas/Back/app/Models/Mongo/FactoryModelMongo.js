
const mongoose = require('mongoose');
const DBConfig = require('../../../config/database')
const MongoTypes = mongoose.Types;
const Schema = mongoose.Schema;

class FactoryModelMongo {

    static createModel(schema, database, collection){

        schema.set('collection', collection);
        mongoose.Promise = global.Promise
        let connection = mongoose.createConnection(DBConfig.mongodb.connectionString + '/' + database, {
          useNewUrlParser: true, 
          useUnifiedTopology: true,
          useFindAndModify: false
        });

        return connection.model(collection, schema);
    }

}

module.exports = {
    MongoTypes,
    FactoryModelMongo,
    Schema
}
