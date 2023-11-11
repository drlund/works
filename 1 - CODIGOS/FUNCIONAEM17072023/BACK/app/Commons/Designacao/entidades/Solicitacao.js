"use strict";

const moment = require("moment");
const _ = require("lodash");

const { arrayToString } = use('App/Commons/ArrayUtils');

const {
  PERFIL,
  PREFIXO_SUPERADM,
  PREFIXO_DIPES,
  PREFIXO_GEPES,
  PREFIXO_DIVAR,
  PREFIXO_DIRAV,
  TIP_DEP,
  NIVEL_GER,
  SITUACOES,
  BD_TXT,
  MENSAGEM,
  CODIGOS_PRIORIZADOS
} = require("../Constants");
const getMainEmail = require("../getMainEmail");

class Solicitacao {
  transformListaSolicitacao(listaSolicitacoes, user) {
    return listaSolicitacoes.map((solicitacao) => {
      solicitacao.key = solicitacao.id;

      solicitacao.analise.analise = JSON.parse(solicitacao.analise.analise);

      const ausencias = JSON.parse(solicitacao.analise.ausencias);

      solicitacao.motivos = [];

      solicitacao.motivos = ausencias.ausencias.map(ausencia => {
        const plural = ausencia.periodo > 1 ? 's' : '';
        return `${ausencia.periodo} dia${plural} por ${ausencia.tipoAusencia}`;
      });

      const perfil = this._getPerfilFunciSolicitacao(
        user, solicitacao
      );

      const perfilAnalise = this._getPerfilAnalise(
        solicitacao.gg_ou_super,
        solicitacao.analise.deacordo_super_destino,
        solicitacao.limitrofes,
        solicitacao.super
      );

      solicitacao.perfilDeAcordo = perfilAnalise.filter(
        (perf) => perfil.includes(perf)
      );

      solicitacao.analise.cadeia = solicitacao.analise.cadeia
        ? JSON.parse(solicitacao.analise.cadeia)
        : [];

      if (solicitacao.id_situacao === SITUACOES.DE_ACORDO_PENDENTE) {
        solicitacao.situacaoOrigem = !!solicitacao.analise.parecer_origem
          ? BD_TXT.SIM
          : BD_TXT.NAO;
        solicitacao.situacaoDestino = !!solicitacao.analise.parecer_destino
          ? BD_TXT.SIM
          : BD_TXT.NAO;

        if (
          solicitacao.analise.gg_ou_super ||
          solicitacao.analise.deacordo_super_destino ||
          solicitacao.limitrofes
        ) {
          solicitacao.situacaoSuperior = !!solicitacao.analise
            .parecer_super_destino
            ? BD_TXT.SIM
            : BD_TXT.NAO;
        } else if (solicitacao.super) {
          solicitacao.situacaoSuperior = !!solicitacao.analise.parecer_diretoria
            ? BD_TXT.SIM
            : BD_TXT.NAO;
        } else {
          solicitacao.situacaoSuperior = MENSAGEM.NAO_OBRIGATORIO;
        }
      }

      const reqs = [
        {
          key: 0,
          corRequisitos: '#CB4335',
          requisitos: 'NÃO',
          textoRequisitos: 'Requisitos NÃO Cumpridos'
        },
        {
          key: 1,
          corRequisitos: '#2ECC71',
          requisitos: 'SIM',
          textoRequisitos: 'Requisitos Cumpridos'
        }
      ];

      const lims = [
        {
          key: 1,
          corLimitrofes: '#CB4335',
          limitrofes: 'NÃO',
          textoLimitrofes: 'Municípios NÃO Limítrofes'
        },
        {
          key: 0,
          corLimitrofes: '#2ECC71',
          limitrofes: 'SIM',
          textoLimitrofes: 'Municípios Limítrofes'
        }
      ];

      ({
        requisitos: solicitacao.requisitos,
        corRequisitos: solicitacao.corRequisitos,
        textoRequisitos: solicitacao.textoRequisitos
      } = _.head(reqs.filter(req => req.key === solicitacao.requisitos)));

      ({
        limitrofes: solicitacao.limitrofes,
        corLimitrofes: solicitacao.corLimitrofes,
        textoLimitrofes: solicitacao.textoLimitrofes
      } = _.head(lims.filter(lim => lim.key === solicitacao.limitrofes)));

      solicitacao.priorizado = !_.isEmpty(ausencias) && !_.isEmpty(ausencias.ausencias.filter(ausencia => CODIGOS_PRIORIZADOS.includes(ausencia.codAusencia)));

      return {
        abrevTipo: solicitacao.tipoDemanda.abrev,
        cadeia: !_.isEmpty(solicitacao.analise) && solicitacao.analise.cadeia.toString().replace(/,/, ', '),
        chaveFunciAusente: solicitacao.matr_dest || null,
        chaveFunciIndicado: solicitacao.matr_orig,
        codFuncaoDestino: solicitacao.funcao_dest || null,
        codFuncaoOrigem: solicitacao.funcao_orig || null,
        corLimitrofes: solicitacao.corLimitrofes,
        corRequisitos: solicitacao.corRequisitos,
        corSituacao: solicitacao.situacao.cor,
        corStatus: solicitacao.status.cor,
        corTipo: solicitacao.tipoDemanda.cor,
        dataFimMovimentacao: moment(solicitacao.dt_fim).format("DD/MM/YYYY"),
        dataInicioMovimentacao: moment(solicitacao.dt_ini).format("DD/MM/YYYY"),
        dataRegistro: moment(solicitacao.dt_solicitacao).format("DD/MM/YYYY"),
        descCargoResponsavel: solicitacao.matricula_resp ? solicitacao.matricula_resp.desc_cargo.trim() : null,
        descLocalizacaoResponsavel: solicitacao.matricula_resp ? solicitacao.matricula_resp.desc_localizacao.trim() : null,
        dotacoes: solicitacao.analise.dotacoes,
        encaminhado: !!solicitacao.encaminhado_para,
        funciSolicitacao: solicitacao.matr_solicit,
        funcionarioOrigem: solicitacao.matr_orig && solicitacao.matricula_orig ? solicitacao.matr_orig + ' ' + solicitacao.matricula_orig.nome.trim() || '' : "Funcionário Inexistente/Fora da Base",
        funcaoOrigem: solicitacao.funcao_orig ? solicitacao.funcao_orig + ' ' + solicitacao.funcaoOrigem?.nome_comissao.trim() || ''  : null,
        funcaoDestino: solicitacao.funcao_dest ? solicitacao.funcao_dest + ' ' + solicitacao.funcaoDestino?.nome_comissao.trim() || ''  : null,
        id: solicitacao.id,
        limitrofes: solicitacao.limitrofes,
        motivosAusencia: solicitacao.motivos,
        nomeFuncaoDestino: solicitacao.funcaoDestino ? solicitacao.funcaoDestino.nome_comissao.trim() : null,
        nomeFuncaoOrigem: solicitacao.funcaoOrigem ? solicitacao.funcaoOrigem.nome_comissao.trim() : null,
        nomeFunciAusente: solicitacao.matricula_dest ? solicitacao.matricula_dest.nome : null,
        nomeFunciIndicado: solicitacao.matricula_orig ? solicitacao.matricula_orig.nome : null,
        nomeFunciSolicitacao: solicitacao.matricula_solicit ? solicitacao.matricula_solicit.nome : 'MATRÍCULA FORA DA BASE',
        nomePrefixoDestino: solicitacao.prefixo_dest ? solicitacao.prefixo_dest.nome : null,
        nomePrefixoOrigem: solicitacao.prefixo_orig ? solicitacao.prefixo_orig.nome : null,
        nomeResponsavel: solicitacao.matricula_resp ? solicitacao.matricula_resp.nome : null,
        nomeSituacao: solicitacao.situacao.curto,
        nomeStatus: solicitacao.status.status,
        nomeTipo: solicitacao.tipoDemanda.nome,
        periodo: moment(solicitacao.dt_ini).format("DD/MM/YYYY") + ' a ' + moment(solicitacao.dt_fim).format("DD/MM/YYYY"),
        perfilDeAcordo: !_.isEmpty(solicitacao.perfilDeAcordo),
        prefixoDestino: solicitacao.pref_dest || null,
        prefixoLotacaoFunciAusente: solicitacao.matricula_dest ? solicitacao.matricula_dest.prefixo_lotacao : null,
        prefixoLotacaoFunciIndicado: solicitacao.matricula_orig ? solicitacao.matricula_orig.prefixo_lotacao : null,
        prefixoLotacaoResponsavel: solicitacao.matricula_resp ? solicitacao.matricula_resp.prefixo_lotacao : null,
        prefixoOrigem: solicitacao.pref_orig,
        prefixosOrigemDestino: (solicitacao.pref_orig ? solicitacao.pref_orig + ' ' + solicitacao.prefixo_orig?.nome.trim() || '' : null)
          + ' - '
          + (solicitacao.pref_dest ? solicitacao.pref_dest + ' ' + solicitacao.prefixo_dest?.nome.trim() || '' : null),
        priorizado: solicitacao.priorizado,
        protocolo: solicitacao.protocolo,
        protocoloStr: solicitacao.protocolo.replace(/\D/g,''),
        qtdeDiasTotais: solicitacao.dias_totais,
        qtdeDiasUteis: solicitacao.dias_uteis,
        requisitos: solicitacao.requisitos,
        responsavel: solicitacao.responsavel || null,
        situacao: solicitacao.id_situacao,
        situacaoDestino: solicitacao.situacaoDestino,
        situacaoOrigem: solicitacao.situacaoOrigem,
        situacaoSuperior: solicitacao.situacaoSuperior,
        status: solicitacao.id_status,
        textoLimitrofes: solicitacao.textoLimitrofes,
        textoRequisitos: solicitacao.textoRequisitos,
        textoSituacao: solicitacao.situacao.descricao,
        textoStatus: solicitacao.status.descricao,
        tipo: solicitacao.tipo,
      }
    });
  }

  async transformGetSolicitacao(solicitacao, user) {
    solicitacao.key = solicitacao.id;

    solicitacao.analise.analise = JSON.parse(solicitacao.analise.analise);
    solicitacao.analise.ausencias = JSON.parse(solicitacao.analise.ausencias);
    solicitacao.analise.negativas = JSON.parse(solicitacao.analise.negativas);
    solicitacao.analise.cadeia = solicitacao.analise.cadeia
      ? JSON.parse(solicitacao.analise.cadeia)
      : [];

    if (solicitacao.id_situacao === 1) {
      solicitacao.situacaoOrigem = !!solicitacao.analise.parecer_origem
        ? "SIM"
        : "NÃO";
      solicitacao.situacaoDestino = !!solicitacao.analise.parecer_destino
        ? "SIM"
        : "NÃO";

      if (
        solicitacao.analise.gg_ou_super ||
        solicitacao.analise.deacordo_super_destino ||
        solicitacao.limitrofes
      ) {
        solicitacao.situacaoSuperior = !!solicitacao.analise
          .parecer_super_destino
          ? "SIM"
          : "NÃO";
      } else if (solicitacao.super) {
        solicitacao.situacaoSuperior = !!solicitacao.analise.parecer_diretoria
          ? "SIM"
          : "NÃO";
      } else {
        solicitacao.situacaoSuperior = "Não Obrigatório";
      }
    }

    /**
     * Cálculo de Situação
     */

    if (solicitacao.id_situacao === 1) {
      solicitacao.pendDeAcordo = false;

      if (!_.isNil(user)) { // && complemento && complemento) {
        // solicitacao.analise.perfil = await getPerfilFunciSolicitacao(user, solicitacao);
        // solicitacao.analise.perfilAnalise = await getPerfilAnalise(
        //   solicitacao.id
        // );

        solicitacao.analise.perfil = this._getPerfilFunciSolicitacao(
          user, solicitacao
        );

        solicitacao.analise.perfilAnalise = this._getPerfilAnalise(
          solicitacao.gg_ou_super,
          solicitacao.analise.deacordo_super_destino,
          solicitacao.limitrofes,
          solicitacao.super
        );

        solicitacao.analise.perfilDeAcordo = _.isEmpty(solicitacao.analise.perfilAnalise) ? [] : solicitacao.analise.perfilAnalise.filter((perfil) => {
          return solicitacao.analise.perfil.includes(perfil);
        });

        solicitacao.situacaoOrigem = !!solicitacao.analise.parecer_origem
          ? "SIM"
          : "NÃO";
        if (!solicitacao.analise.parecer_origem) {
          if (solicitacao.analise.perfilDeAcordo) {
            solicitacao.analise.perfilDeAcordo.includes("gg_orig") &&
              (solicitacao.pendDeAcordo = true);
          }
        }

        solicitacao.situacaoDestino = !!solicitacao.analise.parecer_destino
          ? "SIM"
          : "NÃO";

        if (!solicitacao.analise.parecer_destino) {
          if (solicitacao.analise.perfilDeAcordo) {
            solicitacao.analise.perfilDeAcordo.includes("gg_dest") &&
              (solicitacao.pendDeAcordo = true);
          }
        }

        if (
          solicitacao.analise.gg_ou_super ||
          solicitacao.analise.deacordo_super_destino ||
          solicitacao.limitrofes
        ) {
          solicitacao.situacaoSuperior = !!solicitacao.analise
            .parecer_super_destino
            ? "SIM"
            : "NÃO";

          if (!solicitacao.analise.parecer_super_destino) {
            if (solicitacao.analise.perfilDeAcordo) {
              solicitacao.analise.perfilDeAcordo.filter((x) =>
                [
                  "super_regional_destino",
                  "super_estadual_destino",
                  "comite_super_destino",
                ].includes(x)
              ).length && (solicitacao.pendDeAcordo = true);
            }
          }
        } else if (solicitacao.super) {
          solicitacao.situacaoSuperior = !!solicitacao.analise
            .parecer_diretoria
            ? "SIM"
            : "NÃO";

          if (!solicitacao.analise.parecer_diretoria) {
            if (solicitacao.analise.perfilDeAcordo) {
              solicitacao.analise.perfilDeAcordo.includes([
                "comite_diretoria",
              ]) && (solicitacao.pendDeAcordo = true);
            }
          }
        } else {
          solicitacao.situacaoSuperior = "Não Obrigatório";
        }
      }
    }

    const funcao = solicitacao.funcao_dest || solicitacao.funcao_orig;

    if (
      solicitacao.tipo === 1 &&
      solicitacao.matr_dest === "F0000000" &&
      !solicitacao.matricula_dest
    ) {
      solicitacao.matricula_dest = {
        nome: "VACÂNCIA",
        desc_cargo: funcao.nome_funcao,
      };
    } else {
      solicitacao.comissao_dest = { ...funcao };
    }
    solicitacao.prefixo_orig.email = await getMainEmail(
      solicitacao.prefixo_orig.uor_dependencia
    );
    solicitacao.prefixo_dest.email = await getMainEmail(
      solicitacao.prefixo_dest.uor_dependencia
    );
    !_.isEmpty(solicitacao.prefixo_gerev_dest) &&
      (solicitacao.prefixo_gerev_dest.email = await getMainEmail(
        solicitacao.prefixo_gerev_dest.uor
      ));
    !_.isEmpty(solicitacao.prefixo_super_dest) &&
      (solicitacao.prefixo_super_dest.email = await getMainEmail(
        solicitacao.prefixo_super_dest.uor
      ));
    !_.isEmpty(solicitacao.prefixo_encaminhado_para) &&
      (solicitacao.prefixo_encaminhado_para.email = await getMainEmail(
        solicitacao.prefixo_encaminhado_para.uor_dependencia
      ));

    const TIPO_EMAIL = {
      1: {
        tipo: "Solicitação",
      },
      2: {
        tipo: "Movimentação",
      },
      3: {
        tipo: "Conclusão",
      },
      4: {
        tipo: "Assinaturas",
      },
      5: {
        tipo: "Cobrança",
      },
    };

    solicitacao.mailLog = solicitacao.mail_log.map((mail) => {
      mail.tipoEmail = TIPO_EMAIL[mail.tipo_email].tipo;
      mail.emailsEnviados = arrayToString(mail.campo_para.split(","));
      return mail;
    });

    solicitacao.paaDest = false;
    solicitacao.paaOrig = false;

    if (solicitacao.prefixo_dest.tip_dep === 15) {
      solicitacao.paaDest = true;
      solicitacao.madrinhaDest = await getPrefixoMadrinha(
        solicitacao.pref_dest
      );
    }

    if (solicitacao.prefixo_orig.tip_dep === 15) {
      solicitacao.paaOrig = true;
      solicitacao.madrinhaOrig = await getPrefixoMadrinha(
        solicitacao.pref_orig
      );
    }

    return {
      "analise": {
        ausencias: solicitacao.analise.ausencias.ausencias
      },
      "dias_totais": solicitacao.dias_totais,
      "dias_uteis": solicitacao.dias_uteis,
      "dt_fim": solicitacao.dt_fim,
      "dt_ini": solicitacao.dt_ini,
      "funcao_dest": solicitacao.funcao_dest,
      "funcao_orig": solicitacao.funcao_orig,
      "funcaoDestino": {
        nome_comissao: solicitacao.funcaoDestino ? solicitacao.funcaoDestino.nome_comissao.trim() : ''
      },
      "funcaoOrigem": {
        nome_comissao: solicitacao.funcaoOrigem ? solicitacao.funcaoOrigem.nome_comissao.trim() : ''
      },
      "madrinhaDest": solicitacao.madrinhaDest
        ? {
          nome: solicitacao.madrinhaDest ? solicitacao.madrinhaDest.nome : '',
          prefixo: solicitacao.madrinhaDest ? solicitacao.madrinhaDest.prefixo : '',
          uor: solicitacao.madrinhaDest ? solicitacao.madrinhaDest.uor : '',
        }
        : null,
      "madrinhaOrig": solicitacao.madrinhaOrig
        ? {
          nome: solicitacao.madrinhaOrig ? solicitacao.madrinhaOrig.nome : '',
          prefixo: solicitacao.madrinhaOrig ? solicitacao.madrinhaOrig.prefixo : '',
          uor: solicitacao.madrinhaOrig ? solicitacao.madrinhaOrig.uor : '',
        }
        : null,
      "mailLog": solicitacao.mailLog,
      "matr_dest": solicitacao.matr_dest,
      "matr_orig": solicitacao.matr_orig,
      "matr_solicit": solicitacao.matr_solicit,
      "matricula_dest": {
        nome: solicitacao.matricula_dest ? solicitacao.matricula_dest.nome.trim() : ''
      },
      "matricula_orig": {
        nome: solicitacao.matricula_orig ? solicitacao.matricula_orig.nome.trim() : ''
      },
      "matricula_resp": {
        nome: solicitacao.matricula_resp ? solicitacao.matricula_resp.nome.trim() : ''
      },
      "matricula_solicit": {
        nome: solicitacao.matricula_solicit ? solicitacao.matricula_solicit.nome.trim() : ''
      },
      "optBasica": {
        texto: solicitacao.optBasica ? solicitacao.optBasica.texto : ' '
      },
      "paaDest": solicitacao.paaDest,
      "paaOrig": solicitacao.paaOrig,
      "pref_dest": solicitacao.pref_dest,
      "pref_orig": solicitacao.pref_orig,
      "prefixo_dest": {
        cd_gerev_juris: solicitacao.prefixo_dest.cd_gerev_juris,
        cd_super_juris: solicitacao.prefixo_dest.cd_super_juris,
        nome: solicitacao.prefixo_dest.nome,
        uor_dependencia: solicitacao.prefixo_dest.uor_dependencia,
      },
      "prefixo_gerev_dest": {
        nome: solicitacao.prefixo_dest && solicitacao.prefixo_dest.dadosGerev ? solicitacao.prefixo_dest.dadosGerev.nome : '',
        prefixo: solicitacao.prefixo_dest && solicitacao.prefixo_dest.dadosGerev ? solicitacao.prefixo_dest.dadosGerev.prefixo : '',
        uor: solicitacao.prefixo_dest && solicitacao.prefixo_dest.dadosGerev ? solicitacao.prefixo_dest.dadosGerev.uor : '',
      },
      "prefixo_gerev_orig": {
        nome: solicitacao.prefixo_orig && solicitacao.prefixo_orig.dadosGerev ? solicitacao.prefixo_orig.dadosGerev.nome : '',
        prefixo: solicitacao.prefixo_orig && solicitacao.prefixo_orig.dadosGerev ? solicitacao.prefixo_orig.dadosGerev.prefixo : '',
        uor: solicitacao.prefixo_orig && solicitacao.prefixo_orig.dadosGerev ? solicitacao.prefixo_orig.dadosGerev.uor : '',
      },
      "prefixo_orig": {
        cd_gerev_juris: solicitacao.prefixo_orig ? solicitacao.prefixo_orig.cd_gerev_juris : '',
        cd_super_juris: solicitacao.prefixo_orig ? solicitacao.prefixo_orig.cd_super_juris : '',
        nome: solicitacao.prefixo_orig ? solicitacao.prefixo_orig.nome : '',
        uor_dependencia: solicitacao.prefixo_orig ? solicitacao.prefixo_orig.uor_dependencia : '',
      },
      "prefixo_super_dest": {
        nome: solicitacao.prefixo_dest && solicitacao.prefixo_dest.dadosSuper ? solicitacao.prefixo_dest.dadosSuper.nome : '',
        prefixo: solicitacao.prefixo_dest && solicitacao.prefixo_dest.dadosSuper ? solicitacao.prefixo_dest.dadosSuper.prefixo : '',
        uor: solicitacao.prefixo_dest && solicitacao.prefixo_dest.dadosSuper ? solicitacao.prefixo_dest.dadosSuper.uor : '',
      },
      "prefixo_super_orig": {
        nome: solicitacao.prefixo_orig && solicitacao.prefixo_orig.dadosSuper ? solicitacao.prefixo_orig.dadosSuper.nome : '',
        prefixo: solicitacao.prefixo_orig && solicitacao.prefixo_orig.dadosSuper ? solicitacao.prefixo_orig.dadosSuper.prefixo : '',
        uor: solicitacao.prefixo_orig && solicitacao.prefixo_orig.dadosSuper ? solicitacao.prefixo_orig.dadosSuper.uor : '',
      },
      "protocolo": solicitacao.protocolo,
      "responsavel": solicitacao.responsavel || '',
      "situacao": {
        descricao: solicitacao.situacao.descricao
      },
      "status": {
        descricao: solicitacao.status.descricao
      },
      "tipo": solicitacao.tipo,
      "tipoDemanda": {
        nome: solicitacao.tipoDemanda.nome
      }
    }
  }

  transformGetHistorico(solicitacao, user) {
    const perfil = this._getPerfilFunciSolicitacao(
      user, solicitacao
    );

    const tipo = perfil.reduce((prev, curr) => {
      if (['funci_superadm', 'funci_dipes', 'funci_gepes', 'funci_divar', 'funci_dirav'].includes(curr)) {
        return prev += 1;
      }
      return prev;
    }, 0);

    const historico = tipo === 0 ? solicitacao.historico.filter((elem) => elem.tipo !== 1) : solicitacao.historico;

    return historico.map((hist) => {
      hist.key = hist.id;
      hist.documento && (hist.documento.documento = JSON.parse(hist.documento.documento));

      const history = {};

      history.id = hist.id;
      history.id_solicitacao = hist.id_solicitacao;
      history.data_hora = hist.data_hora;
      history.documento = {
        texto: hist.documento.texto || ' ',
        documento: hist.documento.documento
      };
      history.funcao = hist.funcao;
      history.matricula = hist.matricula;
      history.nome = hist.nome.toUpperCase();
      history.nome_funcao = hist.nome_funcao;
      history.nome_prefixo = hist.nome_prefixo;
      history.prefixo = hist.prefixo;
      history.tipo = hist.tipo;
      history.tipoHistorico = {
        historico: hist.tipoHistorico.historico
      };

      return history;
    });
  }


  transformExportaExcel(solicitacao) {
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

  _getPerfilAnalise(
    gg_ou_super,
    deacordo_super_destino,
    limitrofes,
    superintendente
  ) {
    const perfis = [PERFIL.GG_ORIG, PERFIL.COMITE_ORIG, PERFIL.GG_DEST, PERFIL.COMITE_DEST];

    if (gg_ou_super || deacordo_super_destino || limitrofes) {
      perfis.push(PERFIL.SUPER_REGIONAL_DESTINO);
      perfis.push(PERFIL.SUPER_ESTADUAL_DESTINO);
      perfis.push(PERFIL.COMITE_SUPER_DESTINO);

      perfis.push(PERFIL.SUPER_REGIONAL_ORIGEM);
      perfis.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
      perfis.push(PERFIL.COMITE_SUPER_ORIGEM);

    } else {

      if (gg_ou_super) {
        perfis.push(PERFIL.SUPER_ESTADUAL_DESTINO);
        perfis.push(PERFIL.COMITE_SUPER_DESTINO);

        perfis.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
        perfis.push(PERFIL.COMITE_SUPER_ORIGEM);
      }

      if (superintendente) {
        perfis.push(PERFIL.COMITE_DIRETORIA);
      }

    }
    return perfis;
  }

  _getPerfilFunciSolicitacao(user, solicitacao) {
    const perfil = [];

    const prefixosGestores = [
      PREFIXO_SUPERADM,
      PREFIXO_DIPES,
      PREFIXO_GEPES,
      PREFIXO_DIVAR,
      PREFIXO_DIRAV
    ];

    const getLocalPerfil = {
      [PREFIXO_SUPERADM]: PERFIL.FUNCI_SUPERADM,
      [PREFIXO_DIPES]: PERFIL.FUNCI_DIPES,
      [PREFIXO_GEPES]: PERFIL.FUNCI_GEPES,
      [PREFIXO_DIVAR]: PERFIL.FUNCI_DIVAR,
      [PREFIXO_DIRAV]: PERFIL.FUNCI_DIRAV
    };

    if (prefixosGestores.includes(user.user.prefixo)) {
      perfil.push(getLocalPerfil[user.user.prefixo]);
    }

    // ? Prefixos Intervenientes
    if (user.funciLogado.ag_localiz === solicitacao.pref_orig || user.user.prefixo === solicitacao.pref_orig) {
      perfil.push(PERFIL.FUNCI_ORIG);
      if (user.funciIsAdmin && solicitacao.prefixo_orig.tip_dep !== TIP_DEP.PAA) {
        perfil.push(PERFIL.GG_ORIG);
      }
      if (!user.funciIsAdmin && (user.comiteAdm && user.comiteAdm.PREFIXO) === parseInt(solicitacao.pref_orig)) {
        perfil.push(PERFIL.COMITE_ORIG);
      }
    }

    if (user.funciLogado.ag_localiz === solicitacao.pref_dest || user.user.prefixo === solicitacao.pref_dest) {
      perfil.push(PERFIL.FUNCI_DEST);
      if (user.funciIsAdmin && solicitacao.prefixo_dest.tip_dep !== TIP_DEP.PAA) {
        perfil.push(PERFIL.GG_DEST);
      }
      if (!user.funciIsAdmin && (user.comiteAdm && user.comiteAdm.PREFIXO) === parseInt(solicitacao.pref_dest)) {
        perfil.push(PERFIL.COMITE_DEST);
      }
    }

    if (user.user.prefixo === solicitacao.prefixo_dest?.cd_super_juris) {

      perfil.push(PERFIL.FUNCI_SUPER_DEST);

      // ? Se Super Estadual
      if (user.dadosComissaoFunciLogado.ref_org === NIVEL_GER.G1UT) {
        perfil.push(PERFIL.SUPER_ESTADUAL_DESTINO);
      }
      // ? Se Super Regional
      if (solicitacao.prefixo_dest.gerev === user.user.pref_regional) {
        perfil.push(PERFIL.FUNCI_GEREV_DEST);

        if (user.dadosComissaoFunciLogado.ref_org === NIVEL_GER.G2UT && user.funciIsAdmin) {
          perfil.push(PERFIL.SUPER_REGIONAL_DESTINO);
        }
      }
      if (!_.isEmpty(user.comiteAdm)) {
        perfil.push(PERFIL.COMITE_SUPER_DESTINO);
      }
    }

    if (user.user.prefixo === solicitacao.prefixo_orig?.cd_super_juris) {

      perfil.push(PERFIL.FUNCI_SUPER_ORIG);

      // ? Se Super Estadual
      if (user.dadosComissaoFunciLogado.ref_org === NIVEL_GER.G1UT) {
        perfil.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
      }
      // ? Se Super Regional
      if (solicitacao.prefixo_orig.gerev === user.user.pref_regional) {
        perfil.push(PERFIL.FUNCI_GEREV_ORIG);

        if (user.dadosComissaoFunciLogado.ref_org === NIVEL_GER.G2UT && user.funciIsAdmin) {
          perfil.push(PERFIL.SUPER_REGIONAL_ORIGEM);
        }
      }
      if (!_.isEmpty(user.comiteAdm)) {
        perfil.push(PERFIL.COMITE_SUPER_ORIGEM);
      }
    }

    if (perfil.includes(PERFIL.FUNCI_DIVAR) || perfil.includes(PERFIL.FUNCI_DIRAV)) {
      if (!_.isEmpty(user.comiteAdm)) perfil.push(PERFIL.COMITE_DIRETORIA);
    }

    return perfil;
  }
}

module.exports = Solicitacao;
