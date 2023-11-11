"use strict";

const _ = require('lodash');
const moment = require('moment');
const getDotacaoDependencia = require('../../Arh/getDotacaoDependencia');

const DocumentosRepository = use('App/Commons/Designacao/repositories/DocumentosRepository');

const Database = use("Database");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Analise = use("App/Models/Mysql/Designacao/Analise");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Designacao = use("App/Models/Mysql/Designacao");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const TipoHistorico = use("App/Models/Mysql/Designacao/TipoHistorico");

const {
  isAdmin,
  getOneDependencia,
  getDadosComissaoCompleto,
  getComitesAdmByMatricula,
} = use('App/Commons/Arh');
const FunciAdm = use('App/Models/Mysql/FunciAdm');
const Funci = use('App/Models/Mysql/Arh/Funci');
const Superadm = use('App/Models/Mysql/Superadm');

const {
  getDepESubord,
  getPrefixoMadrinha,
  getDadosFunciOnline,
} = use("App/Commons/Designacao");


const { getListaComitesByMatricula } = use(
  "App/Commons/Arh/dadosComites"
);

const { arrayToString } = require('../../ArrayUtils');

const {
  ANALISE,
  DATABASE_DATETIME_INPUT,
  NIVEL_GER,
  PERFIL,
  PREFIXO_SUPERADM,
  PREFIXO_DIPES,
  PREFIXO_GEPES,
  PREFIXO_DIVAR,
  PREFIXO_DIRAV,
  SITUACOES,
  TIPOS,
  TIPOS_HISTORICO,
  TIPOS_PERFIS_DEACORDO,
  PERFIS_EQUIV,
  BD_TXT,
  IDS_NEGATIVAS,
  STATUS,
} = require('../Constants');
const sendMailDesig = require('../sendMailDesig');

class DeAcordoRepository {
  async setDeAcordo(solicitacao, analise, user, tipo = null, texto = ' ', trx = null) {
    let perfil = await this.getActualFunciProfile(solicitacao, user, analise, trx);

    if (tipo) {
      perfil = perfil.filter(elem => TIPOS_PERFIS_DEACORDO[tipo].includes(elem.perfil));
    }

    for (const i in perfil) {
      let id_historico, nao;

      switch (perfil[i].perfil) {
        case "gg_orig":
          if (!analise.parecer_origem) {
            analise.parecer_origem = 1;
            analise.matr_parecer_origem = user.chave;
            analise.dt_hr_parecer_origem = moment().format(
              DATABASE_DATETIME_INPUT
            );
            id_historico = 2;
          } else {
            nao = 1;
          }
          break;
        case "gg_dest":
          if (!analise.parecer_destino) {
            analise.parecer_destino = 1;
            analise.matr_parecer_destino = user.chave;
            analise.dt_hr_parecer_destino = moment().format(
              DATABASE_DATETIME_INPUT
            );
            id_historico = 3;
          } else {
            nao = 1;
          }
          break;
        case "comite_super_destino":
          if (!analise.parecer_super_destino) {
            analise.parecer_super_destino = 1;
            analise.matr_parecer_super_destino = user.chave;
            analise.dt_hr_parecer_super_destino = moment().format(
              DATABASE_DATETIME_INPUT
            );
            id_historico = 33;
          } else {
            nao = 1;
          }
          break;
        case "super_regional_destino":
          if (!analise.parecer_super_destino) {
            analise.parecer_super_destino = 1;
            analise.matr_parecer_super_destino = user.chave;
            analise.dt_hr_parecer_super_destino = moment().format(
              DATABASE_DATETIME_INPUT
            );
            id_historico = 5;
          } else {
            nao = 1;
          }
          break;
        case "super_estadual_destino":
          if (!analise.parecer_super_destino) {
            analise.parecer_super_destino = 1;
            analise.matr_parecer_super_destino = user.chave;
            analise.dt_hr_parecer_super_destino = moment().format(
              DATABASE_DATETIME_INPUT
            );
            id_historico = 32;
          } else {
            nao = 1;
          }
          break;
        case "comite_diretoria":
          if (!analise.parecer_diretoria) {
            analise.parecer_diretoria = 1;
            analise.matr_parecer_diretoria = user.chave;
            analise.dt_hr_parecer_diretoria = moment().format(
              DATABASE_DATETIME_INPUT
            );
            id_historico = 34;
          } else {
            nao = 1;
          }
          break;
        default:
          nao = 1;
          break;
      }

      if (nao) {
        continue;
      }

      await analise.save(trx);

      const documento = new DocumentosRepository();
      await documento.post({
        id_solicitacao: solicitacao.id,
        id_historico,
        texto: _.isNil(texto) ? ' ' : texto,
        id_negativa: null,
        tipo: null,
      }, null, user, trx);
    }

    //validar se todos os de acordo foram gravados
    return await this.validarDeAcordo(solicitacao, analise, user, trx);
  }

  async getDeAcordo(solicitacao, user) {
    const perfs = await this.getActualFunciProfile(solicitacao, user);

    const perfsEqvs = [...PERFIS_EQUIV.GG_ORIG, ...PERFIS_EQUIV.GG_DEST, ...PERFIS_EQUIV.SUPERIOR];
    let perfis = perfs.filter((elem) => {
      return perfsEqvs.includes(elem.perfil.toUpperCase());
    })

    const perfil = { perfil: [], assinado: [] };

    const TODOS_PERFS = {
      ggOri: false,
      ggDes: false,
      supRegOri: false,
      supRegDes: false,
      supEstOri: false,
      supEstDes: false,
      comSupOri: false,
      comSupDes: false,
      comDir: false,
    };

    if (perfis.length) {
      perfis = perfis.filter((acordo) => {
        if (acordo.perfil === PERFIL.GG_ORIG) {
          TODOS_PERFS.ggOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.GG_DEST) {
          TODOS_PERFS.ggDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.SUPER_REGIONAL_DESTINO) {
          TODOS_PERFS.supRegDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.SUPER_ESTADUAL_DESTINO) {
          TODOS_PERFS.supEstDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.COMITE_SUPER_DESTINO) {
          TODOS_PERFS.comSupDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.SUPER_REGIONAL_ORIGEM) {
          TODOS_PERFS.supRegOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.SUPER_ESTADUAL_ORIGEM) {
          TODOS_PERFS.supEstOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.COMITE_SUPER_ORIGEM) {
          TODOS_PERFS.comSupOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.COMITE_DIRETORIA) {
          TODOS_PERFS.comDir = true;
          return acordo;
        }
      });

      // Verifica se a função de destino é 1GUT e faz o acerto
      if (solicitacao.funcaoDestino.ref_organizacional === NIVEL_GER.G1UT) {
        Object.assign(TODOS_PERFS, {
          ...TODOS_PERFS,
          comSupDes: false,
          comSupOri: false,
          ggOri: false,
          ggDes: false,
          supEstOri: false,
          supRegDes: false,
          supRegOri: false
        });
      }

      if (TODOS_PERFS.ggOri || TODOS_PERFS.ggDes) {
        if (TODOS_PERFS.ggOri && TODOS_PERFS.ggDes) {
          perfil.perfil.push("1o. Gestor dos Prefixos de Origem e de Destino");
        } else if (TODOS_PERFS.ggOri) {
          perfil.perfil.push("1o. Gestor do Prefixo de Origem");
        } else if (TODOS_PERFS.ggDes) {
          perfil.perfil.push("1o. Gestor do Prefixo de Destino");
        }
      }

      if (
        solicitacao.gg_ou_super ||
        solicitacao.limitrofes ||
        solicitacao.super
      ) {
        if (TODOS_PERFS.comDir) {
          perfil.perfil.push(
            "Membro do Comitê de Administração da DIVAR/DIRAV Jurisdicionante"
          );
        }

        if (TODOS_PERFS.supRegDes || TODOS_PERFS.supRegOri) {
          if (TODOS_PERFS.supRegDes && TODOS_PERFS.supRegOri) {
            perfil.perfil.push(
              "Superintendente Regional dos Prefixos de Origem e Destino"
            );
          } else if (TODOS_PERFS.supRegOri) {
            perfil.perfil.push("Superintendente Regional do Prefixo de Origem");
          } else if (TODOS_PERFS.supRegDes) {
            perfil.perfil.push(
              "Superintendente Regional do Prefixo de Destino"
            );
          }
        }

        if (TODOS_PERFS.supEstDes || TODOS_PERFS.supEstOri) {
          if (TODOS_PERFS.supEstDes && TODOS_PERFS.supEstOri) {
            perfil.perfil.push(
              "Superintendente Estadual/SuperAdm dos Prefixos de Origem e Destino"
            );
          } else if (TODOS_PERFS.supEstOri) {
            perfil.perfil.push(
              "Superintendente Estadual/SuperAdm do Prefixo de Origem"
            );
          } else if (TODOS_PERFS.supEstDes) {
            perfil.perfil.push(
              "Superintendente Estadual/SuperAdm do Prefixo de Destino"
            );
          }
        }

        if ((TODOS_PERFS.comSupDes || TODOS_PERFS.comSupOri)
          && !TODOS_PERFS.supEstDes && !TODOS_PERFS.supEstOri) {
          if (TODOS_PERFS.comSupDes && TODOS_PERFS.comSupOri) {
            perfil.perfil.push(
              "Membro do Comitê de Adm da Super. Estadual/SuperAdm dos Prefixos de Origem e Destino"
            );
          } else if (TODOS_PERFS.comSupOri) {
            perfil.perfil.push(
              "Membro do Comitê de Adm da Super. Estadual/SuperAdm do Prefixo de Origem"
            );
          } else if (TODOS_PERFS.comSupDes) {
            perfil.perfil.push(
              "Membro do Comitê de Adm da Super. Estadual/SuperAdm do Prefixo de Destino"
            );
          }
        }
      }

      if (TODOS_PERFS.ggDes) {
        perfil.situacaoDestino = solicitacao.situacaoDestino === BD_TXT.SIM ? true : false;

        if (!TODOS_PERFS.ggDes) {
          perfil.situacaoSuperior = [BD_TXT.SIM, BD_TXT.NAO].includes(solicitacao.situacaoSuperior)
            ? (solicitacao.situacaoSuperior === BD_TXT.SIM ? true : false)
            : null;
        }
      }

      if (TODOS_PERFS.ggOri) {
        perfil.situacaoOrigem = solicitacao.situacaoOrigem === BD_TXT.SIM ? true : false;
      }

      if (TODOS_PERFS.comDir) {
        perfil.situacaoDestino = solicitacao.situacaoDestino === BD_TXT.SIM ? true : false;
        perfil.situacaoOrigem = solicitacao.situacaoOrigem === BD_TXT.SIM ? true : false;
        perfil.situacaoSuperior = [BD_TXT.SIM, BD_TXT.NAO].includes(solicitacao.situacaoSuperior) ? (solicitacao.situacaoSuperior === 'SIM' ? true : false) : null;
      }

      perfil.perfil = arrayToString(perfil.perfil);

      perfil.assinado = perfis
        .map((perfil) => perfil.assinado)
        .reduce((m, v) => m && v);
    } else {
      perfil = {
        perfil: "",
        assinado: false,
      };
    }

    perfil.ggSuper = !!solicitacao.gg_ou_super;
    perfil.limitrofes = !!solicitacao.limitrofes;
    perfil.textoLimitrofes = ' ';
    if (perfil.limitrofes) {
      perfil.textoLimitrofes = _.head(solicitacao.documento.filter((doc) => doc.id_negativa === IDS_NEGATIVAS.LIMITROFES).map(doc => doc.texto));
    }

    perfil.tipo = {
      gestorOrigem: !!TODOS_PERFS.ggOri,
      gestorDestino: !!TODOS_PERFS.ggDes,
      superiorOrigem: (TODOS_PERFS.supRegOri || TODOS_PERFS.supEstOri || TODOS_PERFS.comSupOri),
      superiorDestino: (TODOS_PERFS.supRegDes || TODOS_PERFS.supEstDes || TODOS_PERFS.comSupDes),
      diretoria: !!TODOS_PERFS.comDir
    };

    return perfil;
  }

  async setConcluir(solicitacao, analise, user, parecer, files = null, trx = null) {
    const { id_historico, texto, id_negativa, tipo } = parecer;
    const PARECER = [
      {
        id_historico: TIPOS_HISTORICO.CONCLUIDO,
        id_situacao: SITUACOES.CONCLUIDO,
        id_status: STATUS.AUTORIZADO,
      },
      {
        id_historico: TIPOS_HISTORICO.NEGADO,
        id_situacao: SITUACOES.CONCLUIDO,
        id_status: STATUS.NAO_AUTORIZADO,
      },
      {
        id_historico: TIPOS_HISTORICO.CANCELADO,
        id_situacao: SITUACOES.CANCELADO,
        id_status: STATUS.NAO_AUTORIZADO,
      },
      {
        id_historico: TIPOS_HISTORICO.GRAVADO,
        id_situacao: SITUACOES.CONCLUIDO,
        id_status: STATUS.EXECUTADO,
      },
    ];

    const [comandos] = PARECER.filter((item) => item.id_historico === parecer.id_historico);
    const { id_situacao, id_status } = comandos;
    solicitacao.id_situacao = id_situacao;
    solicitacao.id_status = id_status;

    if (parecer.id_historico === TIPOS_HISTORICO.GRAVADO) {
      const [
        origem,
        destino,
      ] = await Promise.all([
        await getDotacaoDependencia(solicitacao.pref_orig, false, false),
        await getDotacaoDependencia(solicitacao.pref_dest, false, false),
      ]);
      analise.dotacoes = JSON.stringify({ origem: { ...origem }, destino: { ...destino } });
    }

    const documento = new DocumentosRepository();

    await Promise.all([
      analise.save(trx),
      solicitacao.save(trx),
      ,
    ]);

    await documento.post({
      id_solicitacao: solicitacao.id,
      id_historico,
      texto: _.isNil(texto) ? ' ' : texto,
      id_negativa: null,
      tipo: null,
    }, files, user, trx);

    return documento.id;
  }

  async getActualFunciProfile(solicit, user, analise = null, trx = null) {
    let solicitacao;
    if (trx !== null) {
      solicitacao = solicit.toJSON();
      solicitacao.analise = JSON.parse((analise.toJSON()).analise);
    } else {
      solicitacao = { ...solicit };
    }

    let perfFunci = await this.getPerfilFunci(user);
    let perfil = await this.getPerfilFunciSolicitacao(perfFunci.user, solicitacao, perfFunci.funciLogado, perfFunci.comiteAdm, perfFunci.dadosComissaoFunciLogado, perfFunci.funciIsAdmin, trx);
    let perfis = [];

    for (let i = 0; i < perfil.length; i++) {
      if (perfil[i] === 'comite_diretoria') {
        perfis.push({ perfil: perfil[i], assinado: solicitacao.analise[ANALISE.comite_diretoria] });
        continue;
      }
      if (ANALISE[perfil[i]]) {
        perfis.push({ perfil: perfil[i], assinado: solicitacao.analise[ANALISE[perfil[i]]] || 0 });
      }
    }

    return perfis;
  }

  async getPerfilAnalise(solicitacao, analise) {

    const perfis = [PERFIL.GG_ORIG, PERFIL.COMITE_ORIG, PERFIL.GG_DEST, PERFIL.COMITE_DEST];

    // origem e destino mesmo prefixo e UN
    if (await isPrefixoUN(solicitacao.pref_dest)) {
      /**
       * aceita-se gg_orig, gg_dest e super estadual, regional e comite assinando como todos;
       */

      if (solicitacao.gg_ou_super || analise.deacordo_super_destino || solicitacao.limitrofes) {
        perfis.push(PERFIL.SUPER_REGIONAL_DESTINO);
        perfis.push(PERFIL.SUPER_ESTADUAL_DESTINO);
        perfis.push(PERFIL.COMITE_SUPER_DESTINO);

        perfis.push(PERFIL.SUPER_REGIONAL_ORIGEM);
        perfis.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
        perfis.push(PERFIL.COMITE_SUPER_ORIGEM);
      }

    } else {

      if (solicitacao.gg_ou_super) {
        perfis.push(PERFIL.SUPER_ESTADUAL_DESTINO);
        perfis.push(PERFIL.COMITE_SUPER_DESTINO);

        perfis.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
        perfis.push(PERFIL.COMITE_SUPER_ORIGEM);
      }

      if (solicitacao.super) {
        perfis.push(PERFIL.COMITE_DIRETORIA);
      }
    }

    return perfis;
  }

  async getPerfilFunci(usuario) {
    let funciAdm = await FunciAdm.findBy('matricula', usuario.chave);

    /**
     * neste local, caso o funcionário seja superintendente regional, atualmente as consultas abaixo
     * retornam apenas os prefixos abaixo da própria regional.
     * Modificar para retornar todos os prefixos da superintendencia
     */

    let uor_trabalho = await Superadm.query()
      .table("vinculo_gerev")
      .where("uor_trabalho", usuario.uor)
      .first();

    if (uor_trabalho) {
      if (!_.isEmpty(uor_trabalho)) {
        usuario.uor_regional = funciAdm.cod_uor_trabalho = uor_trabalho.uor_gerev;
        usuario.pref_regional = uor_trabalho.prefixo_gerev;
      }
    }

    const { user, funciLogado, dadosComissaoFunciLogado } = await getDadosFunciOnline(usuario);

    const subordinadas = await getDepESubord(user);

    const listaComitesFunci = await getListaComitesByMatricula(user.chave);

    const [comiteAdm] = listaComitesFunci.filter(comite => comite.PREFIXO === parseInt(user.prefixo, 10));

    const funciIsAdmin = await isAdmin(funciLogado.matricula);

    return { user, funciLogado, comiteAdm, dadosComissaoFunciLogado, funciIsAdmin, subordinadas };
  }

  async getPerfilFunciSolicitacao(
    user,
    solicitacao,
    funciLog = null,
    comiteAdm = null,
    nivelGer = null,
    admin = null,
    trx = null
  ) {

    _.isNil(funciLog) && (funciLog = await getOneFunci(user.chave));
    _.isNil(comiteAdm) && (comiteAdm = await getComitesAdmByMatricula(user.chave));
    _.isNil(nivelGer) && (nivelGer = await getDadosComissaoCompleto(user.cod_funcao));
    _.isNil(admin) && (admin = !!nivelGer.flag_administrador);

    if (trx) {
      const solicit = await Solicitacao
        .query()
        .with('prefixo_dest', (query) => {
          query.sb00()
        })
        .with('prefixo_orig', (query) => {
          query.sb00()
        })
        .with('funcaoOrigem')
        .with('funcaoDestino')
        .where('id', solicitacao.id)
        .transacting(trx)
        .first();

      solicitacao = solicit.toJSON();
    }

    let perfil = [];

    // ? Prefixos Gestores
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

    if (prefixosGestores.includes(user.prefixo)) perfil.push(getLocalPerfil[user.prefixo]);

    const [
      isMadrinhaOrig,
      isMadrinhaDest
    ] = await Promise.all([
      getPrefixoMadrinha(solicitacao.pref_orig),
      getPrefixoMadrinha(solicitacao.pref_dest)
    ]);

    // ? Prefixos Intervenientes
    if (funciLog.agenciaLocalizacao === solicitacao.pref_orig || funciLog.ag_localiz === solicitacao.pref_orig) {
      perfil.push(PERFIL.FUNCI_ORIG);
      (admin && solicitacao.prefixo_orig.tip_dep !== 15) && perfil.push(PERFIL.GG_ORIG);
    }

    if (funciLog.agenciaLocalizacao === solicitacao.pref_dest || funciLog.ag_localiz === solicitacao.pref_dest) {
      perfil.push(PERFIL.FUNCI_DEST);
      (admin && solicitacao.prefixo_dest.tip_dep !== 15) && perfil.push(PERFIL.GG_DEST);
    }

    if (!!isMadrinhaOrig && (isMadrinhaOrig.prefixo === funciLog.agenciaLocalizacao || isMadrinhaOrig.prefixo === funciLog.ag_localiz)) {
      perfil.push(PERFIL.FUNCI_ORIG);
      admin && perfil.push(PERFIL.GG_ORIG);
    }

    if (!!isMadrinhaDest && (isMadrinhaDest.prefixo === funciLog.agenciaLocalizacao || isMadrinhaDest.prefixo === funciLog.ag_localiz)) {
      perfil.push(PERFIL.FUNCI_DEST);
      admin && perfil.push(PERFIL.GG_DEST);
    }

    if (user.prefixo === solicitacao.prefixo_dest.cd_super_juris) {

      perfil.push(PERFIL.FUNCI_SUPER_DEST);

      // ? Se Super Estadual
      if (nivelGer.ref_org === NIVEL_GER.G1UT) {
        perfil.push(PERFIL.SUPER_ESTADUAL_DESTINO);
        if (solicitacao.funcaoDestino.ref_organizacional === NIVEL_GER.G1UT) {
          perfil.push(PERFIL.COMITE_DIRETORIA);
        }
      }
      // ? Se Super Regional
      if (solicitacao.prefixo_dest.gerev === user.pref_regional) {
        perfil.push(PERFIL.FUNCI_GEREV_DEST);

        if (nivelGer.ref_org === NIVEL_GER.G2UT && admin) {
          perfil.push(PERFIL.SUPER_REGIONAL_DESTINO);
        }
      }
      if (!_.isEmpty(comiteAdm)) {
        perfil.push(PERFIL.COMITE_SUPER_DESTINO, PERFIL.COMITE_DEST);
      }

    }

    if (user.prefixo === solicitacao.prefixo_orig.cd_super_juris) {

      perfil.push(PERFIL.FUNCI_SUPER_ORIG);

      // ? Se Super Estadual
      if (nivelGer.ref_org === NIVEL_GER.G1UT) {
        perfil.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
      }
      // ? Se Super Regional
      if (solicitacao.prefixo_orig.gerev === user.pref_regional) {
        perfil.push(PERFIL.FUNCI_GEREV_ORIG);

        if (nivelGer.ref_org === NIVEL_GER.G2UT && admin) {
          perfil.push(PERFIL.SUPER_REGIONAL_ORIGEM);
        }
      }
      if (!_.isEmpty(comiteAdm)) {
        perfil.push(PERFIL.COMITE_SUPER_ORIGEM);
      }

    }

    if (perfil.includes(PERFIL.FUNCI_DIVAR) || perfil.includes(PERFIL.FUNCI_DIRAV)) {
      if (!_.isEmpty(comiteAdm)) perfil.push(PERFIL.COMITE_DIRETORIA);
    }

    return perfil;
  }

  async validarDeAcordo(solicitacao, analise, user, trx = null) {
    let completo = !!analise.parecer_destino && !!analise.parecer_origem;

    if (solicitacao.limitrofes) {
      completo = completo && !!analise.parecer_super_destino;
    }

    if (solicitacao.tipo === TIPOS.DESIGNACAO) {
      const nivelGer = await getDadosComissaoCompleto(solicitacao.funcao_dest);

      if (nivelGer.ref_org === NIVEL_GER.G1UN || nivelGer.ref_org === NIVEL_GER.G2UT) {
        completo = completo && !!analise.parecer_super_destino;
      }

      if (nivelGer.ref_org === NIVEL_GER.G1UT) {
        completo = !!analise.parecer_diretoria || !!analise.parecer_super_destino;
      }
    }

    if (completo) {
      await this.validarSituacao(solicitacao, analise, user, SITUACOES.ANALISE_SUPERADM, null, trx);
    }

    return solicitacao.id;
  }

  async validarSituacao(solicitacao, analise, user, novaSituacao, novoStatus, trx = null) {
    const novoHistorico = new DocumentosRepository();

    solicitacao.id_situacao = novaSituacao;
    if (novaSituacao === SITUACOES.ANALISE_SUPERADM) {
      solicitacao.encaminhado_para = PREFIXO_SUPERADM;
    }

    await solicitacao.save(trx);

    if (novaSituacao === SITUACOES.CONCLUIDO) {
      await this.validarStatus(solicitacao, novoStatus, trx);
    }

    await novoHistorico.post({ id_solicitacao: solicitacao.id, id_historico: TIPOS_HISTORICO.SUPERADM, texto: ' ', id_negativa: null, tipo: null }, null, user, trx);

    return novoHistorico.novoHistorico.id;
  }

  async validarStatus(solicitacao, novoStatus, trx = null) {

    solicitacao.id_status = novoStatus;
    solicitacao.concluido = 1;

    await solicitacao.save(trx);

    return solicitacao.id;
  }
}

module.exports = DeAcordoRepository;
