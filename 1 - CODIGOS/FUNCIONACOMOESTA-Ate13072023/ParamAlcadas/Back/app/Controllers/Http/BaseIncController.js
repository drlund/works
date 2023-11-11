'use strict'
const baseIncUtils = use('App/Commons/BaseIncUtils')
const exception = use('App/Exceptions/Handler');

class BaseIncController {

  /**
   * 
   * @param {*} params - parametros da requisicao:
   * 
   * (Integer) nroINC (obrigatorio) - Número da IN
   * (Integer) tipoNormativo (obrigatorio) - tipo de normativo: 
   *            0 - Informacao Auxiliar
   *            1 - Disposição Normativa
   *            2 - Procedimentos
   * 
   * (String) baseItem (opcional) - item pai base no qual serao retornados os filhos.
   * Se for omitido busca o primeiro nível dos titulos da IN informada para o tipo de 
   * normativo solicitado.
   * 
   */
  async findNodes({request, response, session}) {
    let { nroINC, codTipoNormativo, baseItem } = request.allParams();
    let dadosUsuario = session.get('currentUserAccount');

    try {
      let ocorrencias = await baseIncUtils.findNodes({nroINC, codTipoNormativo, baseItem, userRoles: dadosUsuario.roles});
      response.send(ocorrencias);
    } catch (err) {
      if (err.message) {
        throw new exception(err.message, 400);
      } else {
        throw new exception(`Falha ao obter as ocorrências da consulta desta IN: ${nroINC}!`, 400);
      }
    }
  }

  async search({ request, response }) {
    let { searchTerm } = request.allParams();

    try {
      let ocorrencias = await baseIncUtils.searchINCs({searchTerm});
      response.send(ocorrencias);
    } catch (err) {
      if (err.message) {
        throw new exception(err.message, 400);
      } else {
        throw new exception(`Falha ao obter as ocorrências desta consulta!`, 400);
      }
    }
  }

}

module.exports = BaseIncController
