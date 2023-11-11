const exception = use('App/Exceptions/Handler');
const JurisdicoesSubordinadas = use('App/Models/Mysql/JurisdicoesSubordinadas');
const MestreSas = use("App/Models/Mysql/MestreSas");
const _ = require('lodash');
const Constants = use('App/Commons/Designacao/Constants');
const isPrefixoSuperAdm = use('App/Commons/Designacao/isPrefixoSuperAdm');
const { isPrefixoUT } = use('App/Commons/Arh');

async function getPrefixosSubord(user) {

  const prefixos = [{ prefixo: user.prefixo, nome: user.dependencia }];

  return prefixos;
}

module.exports = getPrefixosSubord;
