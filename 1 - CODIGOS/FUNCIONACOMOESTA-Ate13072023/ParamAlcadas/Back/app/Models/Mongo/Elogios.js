const { FactoryModelMongo, MongoTypes, Schema } = use('App/Models/Mongo/FactoryModelMongo');

let elogiosSchema = new Schema ({
  dataCriacao: Date,
  dataRegistro: Date,
  dadosAutor: {
    matricula: String,
    nome: String,
    nomeFuncao: String
  },
  
  listaFuncis: [{
    matricula: String,
    nome: String,
    cargo: String,
    email: String,
    img: String,
    prefixo: String,
    nome_prefixo: String,
    nomeGuerra: String
  }],
  
  listaDependencias: [{
    prefixo: String,
    email: String,
    uor: String,
    nome: String
  }],
  autorizado: {type: Boolean, default: false},
  dataAutorizacao: {type: Date, default: null},
  formData: {
    outros: String,
    dataElogio: String,
    fonteElogio: String,
    textoElogio: String
  },
  
  dadosAutorizador: {
    matricula: String,
    nome: String,
    nomeFuncao: String
  }



} ,{toObject: {virtuals: true}, toJSON: {virtuals: true} });

elogiosSchema.virtual('id').get(function(){
  return this._id.toString();
});

const Elogios = FactoryModelMongo.createModel(elogiosSchema, 'elogios', 'elogios');

module.exports = Elogios;
