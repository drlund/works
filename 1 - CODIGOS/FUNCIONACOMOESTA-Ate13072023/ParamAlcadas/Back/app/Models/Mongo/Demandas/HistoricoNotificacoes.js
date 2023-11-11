const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let historicoNotificacoesSchema = new Schema ({
    dataRegistro: Date,
    tipoEnvio: String,
    dadosResponsavel: Object,
    idDemanda: {type:MongoTypes.ObjectId, ref: 'demandas'}
}, {toObject: {virtuals: true}, toJSON: {virtuals: true} });

historicoNotificacoesSchema.virtual('id').get(function(){
  return this._id.toString();
});

const HistoricoNotificacoes = FactoryModelMongo.createModel(historicoNotificacoesSchema, 'demandas', 'historiconotificacoes');

module.exports = HistoricoNotificacoes;