const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let notificacoesSchema = new Schema ({
    idDemanda: {type:MongoTypes.ObjectId, ref: 'demandas'},
    tipoEnvio: String,
    dataEnvio: Date,
    matriculaEnvio: String,
    emailRemetente: String,
    destinatario: String,
    cicloLembrete: String,
    emailDestinatario: String
}, {toObject: {virtuals: true}, toJSON: {virtuals: true} });

notificacoesSchema.virtual('id').get(function(){
  return this._id.toString();
});

const Notificacoes = FactoryModelMongo.createModel(notificacoesSchema, 'demandas', 'notificacoes');

module.exports = Notificacoes;