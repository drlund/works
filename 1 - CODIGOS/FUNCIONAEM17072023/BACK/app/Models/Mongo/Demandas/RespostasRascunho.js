const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let respostasRascunhoSchema = new Schema ({
    dataSalvamento: Date,
    idDemanda: {type:MongoTypes.ObjectId, ref: 'demandas'},
    respostas: Object,
    matriculaAutor: String,
    prefixoAutor: String,
    identificador: String,
    dadosAutor: Object,
    isRascunho: Boolean
},{toObject: {virtuals: true}, toJSON: {virtuals: true} });

respostasRascunhoSchema.virtual('id').get(function(){
  return this._id.toString();
});

const RespostasRascunho = FactoryModelMongo.createModel(respostasRascunhoSchema, 'demandas', 'respostasrascunho');

module.exports = RespostasRascunho;
