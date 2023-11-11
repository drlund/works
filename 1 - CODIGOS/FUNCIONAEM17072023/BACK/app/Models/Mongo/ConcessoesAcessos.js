const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let concessaoSchema = new Schema({
  identificador: String,
  permissoes: [String],
  ferramenta: { type: MongoTypes.ObjectId, ref: 'permissoesferramentas' },
  tipo: { type: MongoTypes.ObjectId, ref: 'tiposAcesso' },
  log: [String],
  prefixo: String,
  ativo: Number,
  validade: Date,
}, { timestamps: true }, { toObject: { virtuals: true }, toJSON: { virtuals: true } });

concessaoSchema.virtual('id').get(function () {
  return this._id.toString();
});


const ConcessaoAcessos = FactoryModelMongo.createModel(concessaoSchema, 'acessos', 'concessoesacessos');

ConcessaoAcessos.findByIdentificador = () => {

  this.find({});
};

module.exports = ConcessaoAcessos;
