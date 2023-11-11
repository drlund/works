"use strict";

const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacaoReacoesModel = use(
  `${CAMINHO_MODELS}/SolicitacoesReacaoClientes`
);
/**
 *
 *  Função que rgistra uma reação do cliente no banco de dados
 *
 */

const registrarReacaoCliente = async ({
  conteudoReacao,
  dataReacao,
  fonteReacao,
  idSolicitacao,
  matricula,
  nome,
}) => {
  await solicitacaoReacoesModel.create({
    idSolicitacao,
    funciRegistroMatricula: matricula,
    funciRegistroNome: nome,
    conteudoReacao,
    fonteReacao, 
    dataReacao: dataReacao
  });
  
};

module.exports = registrarReacaoCliente;
