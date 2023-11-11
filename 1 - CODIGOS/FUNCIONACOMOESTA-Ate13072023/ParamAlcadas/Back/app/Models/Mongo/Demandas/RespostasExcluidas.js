const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let respostasExcluidasSchema = new Schema ({
  dataRegistro: Date,
  idDemanda: {type:MongoTypes.ObjectId, ref: 'demandas'},
  respostas: Object,
  matriculaAutor: String,
  prefixoAutor: String,
  identificador: String,
  dadosAutor: Object,
  responsavelExclusao: String,
  dataExclusao: Date,

},{toObject: {virtuals: true}, toJSON: {virtuals: true} });

respostasExcluidasSchema.virtual('id').get(function(){
  return this._id.toString();
});

const RespostasExcluidas = FactoryModelMongo.createModel(respostasExcluidasSchema, 'demandas', 'respostasexcluidas');

module.exports = RespostasExcluidas;
