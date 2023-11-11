'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer');
const moment = require("moment");
const _ = require("lodash");

/**
 * SolicitacaoTransformer class
 *
 * @class SolicitacaoTransformer
 * @constructor
 */
class SolicitacaoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (solicitacao) {
    return {
     // add your transformation object here
    }
  }

  transformTabelaPendencias (solicitacao) {
    return {
      id: solicitacao.id,
      protocolo: solicitacao.protocolo,
      cadeia: !_.isEmpty(solicitacao.analise) && solicitacao.analise.cadeia.toString().replace(/,/, ', '),
      tipo: solicitacao.tipo,
      abrevTipo: solicitacao.tipoDemanda.abrev,
      nomeTipo: solicitacao.tipoDemanda.nome,
      corTipo: solicitacao.tipoDemanda.cor,
      prefixoOrigem: solicitacao.pref_orig,
      nomePrefixoOrigem: solicitacao.prefixo_orig ? solicitacao.prefixo_orig.nome : null,
      prefixoDestino: solicitacao.pref_dest || null,
      nomePrefixoDestino: solicitacao.prefixo_dest ? solicitacao.prefixo_dest.nome : null,
      codFuncaoOrigem: solicitacao.funcao_orig || null,
      nomeFuncaoOrigem: solicitacao.funcaoOrigem ? solicitacao.funcaoOrigem.nome_comissao.trim() : null,
      codFuncaoDestino: solicitacao.funcao_dest || null,
      nomeFuncaoDestino: solicitacao.funcaoDestino ? solicitacao.funcaoDestino.nome_comissao.trim() : null,
      chaveFunciIndicado: solicitacao.matr_orig,
      nomeFunciIndicado: solicitacao.matricula_orig ? solicitacao.matricula_orig.nome : null,
      prefixoLotacaoFunciIndicado: solicitacao.matricula_orig ? solicitacao.matricula_orig.prefixo_lotacao : null,
      chaveFunciAusente: solicitacao.matr_dest || null,
      nomeFunciAusente: solicitacao.matricula_dest ? solicitacao.matricula_dest.nome : null,
      prefixoLotacaoFunciAusente: solicitacao.matricula_dest ? solicitacao.matricula_dest.prefixo_lotacao : null,
      motivosAusencia: solicitacao.motivos,
      requisitos: solicitacao.requisitos,
      textoRequisitos: solicitacao.textoRequisitos,
      corRequisitos: solicitacao.corRequisitos,
      limitrofes: solicitacao.limitrofes,
      textoLimitrofes: solicitacao.textoLimitrofes,
      corLimitrofes: solicitacao.corLimitrofes,
      responsavel: solicitacao.responsavel || null,
      nomeResponsavel: solicitacao.matricula_resp ? solicitacao.matricula_resp.nome : null,
      descCargoResponsavel: solicitacao.matricula_resp ? solicitacao.matricula_resp.desc_cargo.trim() : null,
      prefixoLotacaoResponsavel: solicitacao.matricula_resp ? solicitacao.matricula_resp.prefixo_lotacao : null,
      descLocalizacaoResponsavel: solicitacao.matricula_resp ? solicitacao.matricula_resp.desc_localizacao.trim() : null,
      status: solicitacao.id_status,
      nomeStatus: solicitacao.status.status,
      textoStatus: solicitacao.status.descricao,
      corStatus: solicitacao.status.cor,
      situacao: solicitacao.id_situacao,
      nomeSituacao: solicitacao.situacao.curto,
      textoSituacao: solicitacao.situacao.descricao,
      corSituacao: solicitacao.situacao.cor,
      situacaoOrigem: solicitacao.situacaoOrigem,
      situacaoDestino: solicitacao.situacaoDestino,
      situacaoSuperior: solicitacao.situacaoSuperior,
      funciSolicitacao: solicitacao.matr_solicit,
      nomeFunciSolicitacao: solicitacao.matricula_solicit ? solicitacao.matricula_solicit.nome : 'MATRÍCULA FORA DA BASE',
      dataRegistro: moment(solicitacao.dt_solicitacao).format("DD/MM/YYYY"),
      dataInicioMovimentacao: moment(solicitacao.dt_ini).format("DD/MM/YYYY"),
      dataFimMovimentacao: moment(solicitacao.dt_fim).format("DD/MM/YYYY"),
      qtdeDiasUteis: solicitacao.dias_uteis,
      qtdeDiasTotais: solicitacao.dias_totais,
      dotacoes: solicitacao.analise.dotacoes,
      encaminhado: !!solicitacao.encaminhado_para,
      perfilDeAcordo: !_.isEmpty(solicitacao.perfilDeAcordo),
      priorizado: solicitacao.priorizado,
    }
  }

  transformExportaExcel (solicitacao) {
    return {
      protocolo: solicitacao.protocolo,
      tipo: solicitacao.tipoDemanda ? solicitacao.tipoDemanda.nome : null,
      prefixo_origem: solicitacao.pref_orig,
      nome_prefixo_origem: solicitacao.prefixo_orig ? solicitacao.prefixo_orig.nome : null,
      prefixo_destino: solicitacao.pref_dest,
      nome_prefixo_destino: solicitacao.prefixo_dest ? solicitacao.prefixo_dest.nome : null,
      funcao_destino: solicitacao.funcao_dest,
      nome_funcao_destino: solicitacao.funcaoDestino ? solicitacao.funcaoDestino.nome_comissao.trim() : null,
      matricula_origem: solicitacao.matr_orig,
      funci_origem: solicitacao.matricula_orig ? solicitacao.matricula_orig.nome : null,
      matricula_solicitacao: solicitacao.matr_solicit,
      funci_solicitacao: solicitacao.matricula_solicit ? solicitacao.matricula_solicit.nome : null,
      requisitos: solicitacao.requisitos,
      limitrofes: solicitacao.limitrofes,
      status: solicitacao.status ? solicitacao.status.status : null,
      situacao: solicitacao.situacao ? solicitacao.situacao.situacao : null,
      responsavel: solicitacao.responsavel,
      nome_responsavel: solicitacao.matricula_resp && solicitacao.matricula_resp.nome,
      dt_solicitacao: moment(solicitacao.dt_solicitacao).format("DD/MM/YYYY"),
      dt_ini: moment(solicitacao.dt_ini).format("DD/MM/YYYY"),
      dt_fim: moment(solicitacao.dt_fim).format("DD/MM/YYYY"),
    }
  }
}

module.exports = SolicitacaoTransformer
