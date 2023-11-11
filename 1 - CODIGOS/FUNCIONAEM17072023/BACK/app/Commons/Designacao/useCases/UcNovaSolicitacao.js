const _ = require("lodash");
const moment = require("moment");

const { AbstractUserCase } = require("../../AbstractUserCase");

const {
  ATIVO,
  BD,
  DATABASE_DATETIME_INPUT,
  LIMITROFES,
  NEGATIVAS,
  NIVEL_GER,
  SITUACOES,
  STATUS,
  TIPOS_EMAIL,
  TIPOS,
  TIPOS_HISTORICO,
} = use("App/Commons/Designacao/Constants");

class UcNovaSolicitacao extends AbstractUserCase {

  async _action({
    dados,
    user
  }) {
    const {
      analiseRepository,
      deAcordoRepository,
      documentoRepository,
      mailRepository,
      solicitacaoRepository,
    } = this.repository;

    const trx = this.trx;

    const solicitacao = await this._createSolicitacao({ dados, user });
    const novaSolicitacao = await solicitacaoRepository.post(solicitacao, trx);

    const analise = await this._createAnalise({ solicitacao: novaSolicitacao, dados });
    const novaAnalise = await analiseRepository.post(analise, trx);

    const documento = await this._createDocumento();
    analise.id_solicitacao = documento.id_solicitacao = novaSolicitacao.id;


    const novoDocumento = await documentoRepository.post(documento, null, user, trx);

    await deAcordoRepository.setDeAcordo(
      novaSolicitacao,
      novaAnalise,
      user,
      null,
      null,
      this.trx);

    dados.protocolo && await solicitacaoRepository.set('cadeia', dados, novaSolicitacao, user, trx);
    await mailRepository.post(TIPOS_EMAIL.SOLICITACAO, novaSolicitacao, novaAnalise, novoDocumento, trx);

    return novaSolicitacao;
  }

  async _checks({
    dados,
    user
  }) {
    const {
      isPrefixoUN,
      isAdmin,
      getPrefixoMadrinha,
    } = this.functions;

    const isUnidNeg = await isPrefixoUN(user.prefixo);
    let administrador = null;
    let agMadrinha = null;

    if (dados.destino.prefixo === user.prefixo) {
      administrador = await isAdmin(user.chave);
    } else {
      agMadrinha = await getPrefixoMadrinha(dados.destino.prefixo);
      if (isUnidNeg) {
        if (agMadrinha.prefixo === user.prefixo) {
          administrador = await isAdmin(user.chave);
        }
      }
    }
  }

  // Solicitação
  async _createSolicitacao({ dados, user }) {
    const solicitacao = {};

    solicitacao.tipo = dados.tipo;
    solicitacao.pref_orig = dados.origem.prefixo;
    solicitacao.pref_dest = dados.destino.prefixo;
    solicitacao.funcao_orig = dados.origem.funcao_lotacao;
    solicitacao.funcao_dest = dados.tipo === TIPOS.DESIGNACAO
      ? dados.destino.cod_comissao
      : dados.origem.funcao_lotacao;
    solicitacao.matr_orig = dados.origem.matricula;

    if (dados.tipo === TIPOS.DESIGNACAO) {
      solicitacao.matr_dest = dados.vaga.funci;
      solicitacao.id_optbasica = dados.destino.optbasica.id;
    }

    solicitacao.id_situacao = SITUACOES.DE_ACORDO_PENDENTE;
    solicitacao.id_status = STATUS.SOLICITADO;
    solicitacao.matr_solicit = user.chave;

    solicitacao.dt_ini = moment(dados.dt_ini)
      .startOf('day').format(DATABASE_DATETIME_INPUT);
    solicitacao.dt_fim = moment(dados.dt_fim)
      .startOf('day').format(DATABASE_DATETIME_INPUT);
    solicitacao.dt_solicitacao = moment()
      .startOf('day').format(DATABASE_DATETIME_INPUT);
    solicitacao.dias_totais = dados.dias_totais;
    solicitacao.dias_uteis = dados.dias_uteis;

    // se limitrofes, registre NAO
    solicitacao.limitrofes = dados.limitrofes.limitrofes ? LIMITROFES.SIM : LIMITROFES.NAO;

    // Se a movimentação é para Superintendente Estadual ou Superadm
    solicitacao.super = dados.nivelGer && dados.nivelGer.ref_org === NIVEL_GER.G1UT ? BD.SIM : BD.NAO;

    // se a movimentação é para GG, para Superintendente Regional ou Superintendente Regional/Superadm,
    // a informação gg_ou_super informa a necessidade de autorização de superior hierárquico
    solicitacao.gg_ou_super = dados.nivelGer
      && (
        [NIVEL_GER.G1UN, NIVEL_GER.G1UT].includes(dados.nivelGer.ref_org)
        || (NIVEL_GER.G2UT === dados.nivelGer.ref_org && dados.nivelGer.flag_administrador))
      ? BD.SIM : BD.NAO;

    // Se a solicitação cumpriu todos os requisitos, exceto limitrofes
    dados.negativasArr = _.isEmpty(dados.negativas)
      ? dados.negativas.filter((elem) => elem !== NEGATIVAS.LIMITROFES)
      : [];

    solicitacao.requisitos = _.isEmpty(dados.negativasArr) ? BD.SIM : BD.NAO;

    dados.requisitos = solicitacao.requisitos;

    solicitacao.ativo = ATIVO;

    return solicitacao;
  }
  // Análise
  async _createAnalise({ solicitacao, dados }) {
    const analise = {};

    const motivosDeAcordoSuperDestino = [
      (
        dados.tipo === TIPOS.DESIGNACAO
        && dados.nivelGer
        && dados.nivelGer.ref_org === NIVEL_GER.G3UN
        && !dados.limitrofes.limitrofes
      ),
      (
        dados.tipo === TIPOS.DESIGNACAO
        && dados.nivelGer
        && (
          dados.nivelGer.ref_org === NIVEL_GER.G1UN
          || dados.nivelGer.ref_org === NIVEL_GER.G2UT
        )
      ),
      (
        dados.tipo === TIPOS.ADICAO
        && !dados.limitrofes.limitrofes
      )
    ];

    analise.deacordo_super_destino = motivosDeAcordoSuperDestino.includes(true) ? BD.SIM : BD.NAO;
    analise.gg_ou_super = solicitacao.gg_ou_super;
    analise.id_solicitacao = solicitacao.id;
    analise.analise = JSON.stringify(dados.analise);
    analise.negativas = JSON.stringify(dados.negativas);
    analise.ausencias = JSON.stringify({
      ausencias: dados.vaga.ausencias,
      total_ausencia: dados.dias_totais,
    });

    return analise;
  }
  // Documentos
  async _createDocumento() {
    return {id_historico: TIPOS_HISTORICO.INCLUSAO};
  }

}

module.exports = UcNovaSolicitacao;
