const _ = require('lodash');
const AcessoPlataformas = use('App/Models/Mysql/AcessoPlataforma');
// const pretifyDependencia = use('App/Commons/Arh/pretifyDependencia');
const exception = use('App/Exceptions/Handler')

/**
 * Retorna os dados de acesso dos funcis das plataformas
 * A consulta por matrícula é primária, se a matricula for informada não será realizada a consulta por uor de trabalho
 * Consulta por matricula retorna somente o funci pesquisado
 * Consulta por uor de trabalho retorna array de funcis
 * @param {String} matricula 
 * @param {String} uorTrabalho 
 */
async function getFuncisPlataforma(matricula = null, uorTrabalho = null) {

  let retorno;
  
  if (!_.isNil(matricula)){

    const permissaoByMatricula = await AcessoPlataformas.findBy('matricula', matricula);
    if (_.isNil(permissaoByMatricula)) {
      retorno = null;
    } else {
      retorno = permissaoByMatricula.toJSON();
    }
  }

  if (_.isNil(retorno) && _.isNil(matricula)) {
    
    const permissaoByUor = await AcessoPlataformas.query()
      .where('uor_trabalho', uorTrabalho)
      .fetch();
  
    if (_.isNil(permissaoByUor)) {
      retorno = null;
    } else {
      retorno = permissaoByUor.toJSON();
    }
  }

  return retorno;
}

module.exports = getFuncisPlataforma;