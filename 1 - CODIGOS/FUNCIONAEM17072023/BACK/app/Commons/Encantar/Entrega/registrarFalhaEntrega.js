"use strict";

/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");
const {
  STATUS_SOLICITACAO,
  CAMINHO_MODELS,
  CAMINHO_COMMONS,
  ACOES_HISTORICO_SOLICITACAO,
} = EncantarConsts;
/** @type {typeof import('../../../Commons/Encantar/salvarAnexos')} */
const salvarAnexos = use(`${CAMINHO_COMMONS}/salvarAnexos`);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
const solicitacoesModel = use(`${CAMINHO_MODELS}/SolicitacoesFalhaEntrega`);

const registrarFalhaEntrega = async (
  trx,
  idSolicitacao,
  justificativa,
  dataDevolucao,
  responsavelRegistro,
  anexos
) => {
  const solicitacao = await solicitacoesModel.find(idSolicitacao);
  solicitacao.idSolicitacoesStatus = STATUS_SOLICITACAO.ENTREGA_MAL_SUCEDIDA;

  await solicitacao.save(trx);

  const falhaEntrega = await solicitacao.falhaEntrega.create(
    {
      justificativa,
      dataDevolucao,
    },
    trx
  );

  await salvarAnexos(
    falhaEntrega,
    anexos,
    "falhaEntrega",
    responsavelRegistro.chave,
    trx
  );

  await solicitacao.historico().create(
    {
      matriculaFunci: responsavelRegistro.chave,
      nomeFunci: responsavelRegistro.nome_usuario,
      prefixo: responsavelRegistro.prefixo,
      nomePrefixo: responsavelRegistro.dependencia,
      idAcao: ACOES_HISTORICO_SOLICITACAO.REGISTRAR_ENTREGA_MAL_SUCEDIDA,
    },
    trx
  );
};
