const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let respostasSchema = new Schema ({
  dataRegistro: Date,
  idDemanda: {type:MongoTypes.ObjectId, ref: 'demandas'},
  respostas: Object,
  matriculaAutor: String,
  prefixoAutor: String,
  identificador: String,
  dadosAutor: Object

},{toObject: {virtuals: true}, toJSON: {virtuals: true} });

respostasSchema.virtual('id').get(function(){
  return this._id.toString();
});

const Respostas = FactoryModelMongo.createModel(respostasSchema, 'demandas', 'respostas');

module.exports = Respostas;
