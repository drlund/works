const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let historicoElogiosODISchema = new Schema ({

  dataRegistro: Date,
  dadosAutorizador: {
    matricula: String,
    nome: String,
    nomeFuncao: String
  },
  dadosODI: {
    matricula: String,
    nome: String,
    cargo: String,
    email: String,
    img: String,
    prefixo: String,
    nome_prefixo: String,
    odi: String,
  },
  elogio: MongoTypes.ObjectId
    /** As opções abaixo são para garantir que o campo virtual id seja exibido nos resultados */
}, {toObject: {virtuals: true}, toJSON: {virtuals: true}});

historicoElogiosODISchema.set('collection', 'historicoODI')

/**
 *   Para garantir a compatibilidade na migração do SailsJS é necessário ter um campo chamado id, do tipo string.
 *
 */

historicoElogiosODISchema.virtual('id').get(function(){
  return this._id.toString();
});


const HistoricoElogiosODIModel = FactoryModelMongo.createModel(historicoElogiosODISchema, 'elogios', 'historicoODI');

module.exports = HistoricoElogiosODIModel;
