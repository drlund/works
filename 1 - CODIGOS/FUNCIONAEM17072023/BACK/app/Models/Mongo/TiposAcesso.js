const { FactoryModelMongo, Schema } = use('App/Models/Mongo/FactoryModelMongo');

const schema = new Schema({
    tipo: String,
    nome: String,
},{toObject: {virtuals: true}, toJSON: {virtuals: true} });

schema.virtual('id').get(function(){
  return this._id.toString();
});

const TiposAcesso = FactoryModelMongo.createModel(schema, 'acessos', 'tiposAcesso');

module.exports = TiposAcesso;
