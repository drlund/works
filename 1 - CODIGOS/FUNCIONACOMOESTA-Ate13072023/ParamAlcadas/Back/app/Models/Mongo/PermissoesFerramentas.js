const { FactoryModelMongo, Schema } = use('App/Models/Mongo/FactoryModelMongo');

const schema = new Schema({
    nomeFerramenta: String,
    listaPermissoes: [{
      id: String, item: String, descricao: String
    }],
},{toObject: {virtuals: true}, toJSON: {virtuals: true} });

schema.virtual('id').get(function(){
  return this._id.toString();
});

const PermissoesFerramentas = FactoryModelMongo.createModel(schema, 'acessos', 'permissoesferramentas');

module.exports = PermissoesFerramentas;
