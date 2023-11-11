const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let historicoElogiosSchema = new Schema ({

  elogio: MongoTypes.ObjectId,
  dataRegistro: Date,
  dadosAutor: {
    matricula: String,
    nome: String,
    nomeFuncao: String
  },
  acao: String

},{toObject: {virtuals: true}, toJSON: {virtuals: true} });

historicoElogiosSchema.set('collection', 'historicoelogios')

historicoElogiosSchema.virtual('id').get(function(){
  return this._id.toString();
});

const HistoricoElogios = FactoryModelMongo.createModel(historicoElogiosSchema, 'elogios', 'historicoelogios');

module.exports = HistoricoElogios;
