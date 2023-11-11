"use strict";

const outorgadoSnapshotModel = use(
  "App/Models/Mysql/Procuracao/OutorgadoSnapshot"
);

class OutorgadosRepository {
  async cadastrarOutorgado(dadosOutorgado, trx) {
    const outorgado = await outorgadoSnapshotModel.create(dadosOutorgado, trx);
    return /** @type {OutorgadoSnapshot} */(outorgado.toJSON());
  }
}

module.exports = OutorgadosRepository;

/**
 * @typedef {{
 *  id: number,
 *  matricula: string,
 *  cpf: string,
 *  rg: string,
 *  nome: string,
 *  estadoCivil: string,
 *  cargoCodigo: string,
 *  cargoNome: string,
 *  lotacaoCodigo: string,
 *  lotacaoNome: string,
 *  lotacaoMunicipio: string,
 *  lotacaoUf: string,
 *  lotacaoEndereco: string,
 *  createdAt: string,
 *  updatedAt: string,
 * }} OutorgadoSnapshot
 */
