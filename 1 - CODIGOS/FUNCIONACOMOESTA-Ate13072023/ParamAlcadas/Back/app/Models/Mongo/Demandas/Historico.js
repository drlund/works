const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let historicoSchema = new Schema ({
    dataRegistro: Date,
    idDemanda: {type:MongoTypes.ObjectId, ref: 'demandas'},
    acao: String,
    dadosDemanda: Object,
    dadosResponsavel: Object
}, {toObject: {virtuals: true}, toJSON: {virtuals: true} });

historicoSchema.virtual('id').get(function(){
  return this._id.toString();
});

const Historico = FactoryModelMongo.createModel(historicoSchema, 'demandas', 'historico');

module.exports = Historico;