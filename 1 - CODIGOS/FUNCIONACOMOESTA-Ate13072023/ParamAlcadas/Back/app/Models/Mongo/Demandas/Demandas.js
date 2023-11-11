const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let demandasSchema = new Schema ({
  dataCriacao: Date,
  geral: {
    status: Number,
    statusText: String,
    titulo: String,
    descricao: String,
    dadosContato: String,
    dataExpiracao: Date
  },
  perguntas: [Object],
  colaboradores: [Object],
  publicoAlvo: Object,
  notificacoes: Object,
  encerrada: Boolean,
  totalConvites: Number,
  totalLembretes: Number,
  totalEnvioLembretes: Number,
  enviandoConvites: Boolean,
  enviandoLembretes: Boolean,
  convitesEnviados: Boolean
}, {toObject: {virtuals: true}, toJSON: {virtuals: true} });

demandasSchema.virtual('id').get(function(){
  return this._id.toString();
});

demandasSchema.virtual('respostas', {
  ref: 'respostas',
  localField: '_id',
  foreignField: 'idDemanda'
});

demandasSchema.virtual('historico', {
  ref: 'historico',
  localField: '_id',
  foreignField: 'idDemanda'
});

const Demandas = FactoryModelMongo.createModel(demandasSchema, 'demandas', 'demandas');

module.exports = Demandas;