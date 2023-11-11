"use strict";

const _ = require('lodash');
const moment = require('moment');

const { SITUACOES, STATUS } = require('../Constants');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");

const {
  DATABASE_DATETIME_INPUT,
  ABAS,
  PREFIXO_SUPERADM
} = use('App/Commons/Designacao/Constants');

class SolicitacoesRepository {
  constructor() {
    this.novaSolicitacao = null;
    this.solicitacao = null;
    this.solicitacoes = null;
  }

  async post(solicitacao, trx = null) {
    this.novaSolicitacao = new Solicitacao();
    Object.assign(this.novaSolicitacao, solicitacao);
    await this.novaSolicitacao.save(trx);

    this.novaSolicitacao.protocolo =
      moment(this.novaSolicitacao.dt_solicitacao).year() +
      "-" +
      String(this.novaSolicitacao.id).padStart(8, "0");

    await this.novaSolicitacao.save(trx);

    return this.novaSolicitacao;
  }

  async set(id, campoValor, trx = null) {
    this.solicitacao = await Solicitacao.find(id);
    this.solicitacao.merge({
      ...campoValor
    });
    await this.solicitacao.save(trx);
    return this.solicitacao;
  };

  async getOne(id) {
    this.solicitacao = await Solicitacao.find(id);

    return this.solicitacao.toJSON();
  }

  async getListaSolicitacoes(consulta, user) {
    const solicit = Solicitacao.query()
      .with("prefixo_orig", (query) => {
        query.sb00()
      })
      .with("prefixo_dest", (query) => {
        query.sb00()
      })
      .with("matricula_orig")
      .with("matricula_dest")
      .with("matricula_solicit")
      .with("matricula_resp")
      .with("optBasica")
      .with("situacao")
      .with("status")
      .with("tipoDemanda")
      .with("analise")
      .with("prefixo_encaminhado_para", (query) => {
        query.sb00()
      })
      .with("funcaoOrigem")
      .with("funcaoDestino")
      .has("analise")
      .orderBy("dt_solicitacao", "desc");

    solicit.where(this._getMetodoConsulta(consulta, user));

    this.solicitacoes = await solicit.fetch();

    return this.solicitacoes.toJSON();
  }

  async getListaSolicitacoesPorFiltro(consulta, user) {
    const solicit = Solicitacao.query()
      .with("prefixo_orig", (query) => {
        query.sb00()
      })
      .with("prefixo_dest", (query) => {
        query.sb00()
      })
      .with("matricula_orig")
      .with("matricula_dest")
      .with("matricula_solicit")
      .with("matricula_resp")
      .with("optBasica")
      .with("situacao")
      .with("status")
      .with("tipoDemanda")
      .with("analise")
      .with("prefixo_encaminhado_para", (query) => {
        query.sb00()
      })
      .with("funcaoOrigem")
      .with("funcaoDestino")
      .has("analise")
      .orderBy("dt_solicitacao", "desc");

    this._consultas(solicit, consulta, user);

    const solicitacoes = await solicit.fetch();

    return solicitacoes.toJSON();
  }

  async getListaSolicitacoesConcluidas() {
    const solicitacoes = await Solicitacao.query()
      .with("prefixo_orig", (query) => {
        query.sb00()
      })
      .with("prefixo_dest", (query) => {
        query.sb00()
      })
      .with("matricula_orig")
      .with("matricula_dest")
      .with("matricula_solicit")
      .with("matricula_resp")
      .with("optBasica")
      .with("situacao")
      .with("status")
      .with("tipoDemanda")
      .with("analise")
      .with("prefixo_encaminhado_para", (query) => {
        query.sb00()
      })
      .with("funcaoOrigem")
      .with("funcaoDestino")
      .has("analise")
      .where("id_status", 2)
      .where("id_situacao", 5)
      .where("concluido", 0)
      .orderBy("id", "desc")
      .fetch();

    return solicitacoes.toJSON();
  }

  async getOneSolicitacao(id, user) {
    this.solicitacao = await Solicitacao.query()
      .with("prefixo_orig", (builder) => {
        builder
          .with('dadosDiretoria', (query) => {
            query.sb00()
          })
          .with('dadosSuper', (query) => {
            query.sb00()
          })
          .with('dadosGerev', (query) => {
            query.sb00()
          })
          .sb00()
      })
      .with("prefixo_dest", (builder) => {
        builder
          .with('dadosDiretoria', (query) => {
            query.sb00()
          })
          .with('dadosSuper', (query) => {
            query.sb00()
          })
          .with('dadosGerev', (query) => {
            query.sb00()
          })
          .sb00()
      })
      .with("matricula_orig")
      .with("matricula_dest")
      .with("matricula_solicit")
      .with("matricula_resp")
      .with("optBasica")
      .with("situacao")
      .with("status")
      .with("tipoDemanda")
      .with("analise")
      .with("prefixo_encaminhado_para", (query) => {
        query.sb00()
      })
      .with("funcaoOrigem")
      .with("funcaoDestino")
      .with("historico", (builder) => {
        builder
          .with('tipoHistorico')
          .with('documento')
          .orderBy('id', 'desc')
      })
      .with("documento")
      .with("mail_log", (builder) => {
        builder.orderBy("id", "desc")
      })
      .where("id", id)
      .first();

    return this.solicitacao.toJSON();
  }

  async getSolicitacao(id) {
    return await Solicitacao.query()
    .with("prefixo_orig", (builder) => {
      builder
        .with('dadosDiretoria', (query) => {
          query.sb00()
        })
        .with('dadosSuper', (query) => {
          query.sb00()
        })
        .with('dadosGerev', (query) => {
          query.sb00()
        })
        .sb00()
    })
    .with("prefixo_dest", (builder) => {
      builder
        .with('dadosDiretoria', (query) => {
          query.sb00()
        })
        .with('dadosSuper', (query) => {
          query.sb00()
        })
        .with('dadosGerev', (query) => {
          query.sb00()
        })
        .sb00()
    })
    .with("matricula_orig")
    .with("matricula_dest")
    .with("matricula_solicit")
    .with("matricula_resp")
    .with("optBasica")
    .with("situacao")
    .with("status")
    .with("tipoDemanda")
    .with("analise")
    .with("prefixo_encaminhado_para", (query) => {
      query.sb00()
    })
    .with("funcaoOrigem")
    .with("funcaoDestino")
    .with("historico", (builder) => {
      builder
        .with('tipoHistorico')
        .with('documento')
        .orderBy('id', 'desc')
    })
    .with("documento")
    .with("mail_log", (builder) => {
      builder.orderBy("id", "desc")
    })
    .where("id", id)
    .first();
  }

  async isFunciJaSolicitado(funci, dataInicial, dataFinal) {
    const funcionario = await Solicitacao.query()
      .where('matr_orig', funci)
      .where((builder) => {
        builder
          .where('dt_ini', '<=', dataInicial)
          .orWhere('dt_fim', '>=', dataFinal);
      })
      .whereNotIn('id_situacao', [SITUACOES.DE_ACORDO_PENDENTE, SITUACOES.CONCLUIDO, SITUACOES.CANCELADO])
      .fetch();

    return funcionario.toJSON();
  }

  async _getUserPrivileges(user) {

  }

  _getMetodoConsulta(consulta, user) {
    if (consulta === ABAS.DEACORDO) {
      return this._getQueryDeAcordo(user);
    }
    if (consulta === ABAS.ANALISE_OUTROS) {
      return this._getQueryAnaliseOutros(user);
    }
    if (consulta === ABAS.ANALISE_PREFIXO) {
      return this._getQueryAnalisePrefixo(user);
    }
    return this._getQueryMinhasPendencias(user);
  }

  _getQueryDeAcordo(user) {
    return (builder) => {
      if (
        user.user.isUN
        || user.user.isGerev[0]
        || user.user.isDIVAR
        || user.user.isDIRAV
        || user.user.isPlataformaSuperAdm[0]
      ) {
        builder.where((builderPref) => {
          builderPref
            .whereIn("pref_orig", [user.user.prefixo, ...user.subordinadas])
            .orWhereIn("pref_dest", [user.user.prefixo, ...user.subordinadas]);
        })
      }
      builder.where("id_situacao", SITUACOES.DE_ACORDO_PENDENTE)
        .where("id_status", STATUS.SOLICITADO)
    };
  }

  _getQueryAnaliseOutros(user) {
    return (builder) => {
      builder
        .where((bld1) => {
          if (user.user.isSupAdm && !user.user.isPlataformaSuperAdm[0]) {
            bld1.where((builderPref2) => {
              builderPref2.whereNot("encaminhado_para", PREFIXO_SUPERADM);
            });
          }

          if (
            (user.user.isSupAdm && user.user.isPlataformaSuperAdm[0])
            || user.user.isUN
            || user.user.isGerev[0]
          ) {
            bld1.where((builderPref2) => {
              builderPref2.whereNotIn("encaminhado_para", [user.user.prefixo, ...user.subordinadas]);
            })
              .where((builderPref) => {
                builderPref //(t1.pref_orig IN ('2636') OR t1.pref_dest IN ('2636'))
                  .whereIn("pref_orig", [user.user.prefixo, ...user.subordinadas])
                  .orWhereIn("pref_dest", [user.user.prefixo, ...user.subordinadas]);
              })
          }
        })
        .whereNotIn("id_situacao", [SITUACOES.DE_ACORDO_PENDENTE, SITUACOES.CONCLUIDO, SITUACOES.CANCELADO]); //AND t1.id_situacao = 1)
    };
  }

  _getQueryAnalisePrefixo(user) {
    return (builder) => {
      builder
        .where((bld1) => {
          bld1
            .where((builderPref) => {
              builderPref.where("encaminhado_para", user.user.prefixo); //t1.encaminhado_para ='2636'
            });
        })
        .whereNotIn("id_situacao", [SITUACOES.DE_ACORDO_PENDENTE, SITUACOES.CONCLUIDO, SITUACOES.CANCELADO]); //AND t1.id_situacao = 1)
    };
  }

  _getQueryMinhasPendencias(user) {
    return (builder) => {
      builder
        .where("responsavel", user.user.chave)
        .whereNotIn("id_situacao", [SITUACOES.DE_ACORDO_PENDENTE, SITUACOES.CONCLUIDO, SITUACOES.CANCELADO]);
    };
  }

  _consultas(builder, consulta, user) {
    if (consulta.tipoConsulta === 1) {
      if (consulta.prefixo) {
        builder.where((builderPref) => {
          builderPref
            .whereIn("pref_orig", [consulta.prefixo.prefixo])
            .orWhereIn("pref_dest", [consulta.prefixo.prefixo]);
        });
      }
      if (!consulta.prefixo) {
        if (!user.user.isSupAdm) {
          builder.where((builderPref) => {
            builderPref
              .whereIn("pref_orig", [user.user.prefixo, ...user.subordinadas])
              .orWhereIn("pref_dest", [user.user.prefixo, ...user.subordinadas]);
          });
        }
      }

      if (consulta.funcao) {
        builder.where((builderPref) => (
          builderPref.where("funcao_dest", consulta.funcao.funcao)
        ));
      }

      if (consulta.funci) {
        builder.where((builderPref) => {
          builderPref
            .where("matr_orig", consulta.funci.funci)
            .orWhere("matr_dest", consulta.funci.funci);
        });
      }

      if (consulta.tipo) {
        const tipo = consulta.tipo.map((tip) => tip.tipo);
        builder.where((builderPref) => (
          builderPref.whereIn("tipo", tipo)
        ));
      }

      if (consulta.status) {
        const status = consulta.status.map((stat) => stat.status);
        builder.where((builderPref) => (
          builderPref.whereIn("id_status", status)
        ));
      }

      if (consulta.situacao) {
        const situacao = consulta.situacao.map((sit) => sit.situacao);
        builder.where((builderPref) => (
          builderPref.whereIn("id_situacao", situacao)
        ));
      }

      if (consulta.instancia) {
        const instancia = consulta.instancia.map((inst) => inst.instancia);
        builder.where((builderPref) => {
          builderPref
            .with("historico")
            .has("historico", (qry) => qry.whereIn('id_historico', instancia));
        });
      }

      if (consulta.periodo) {
        builder.where((builderPref) => {
          builderPref
            .where("dt_ini", ">=", moment(consulta.periodo.inicio).format(DATABASE_DATETIME_INPUT))
            .where("dt_fim", "<=", moment(consulta.periodo.fim).format(DATABASE_DATETIME_INPUT));
        });
      }

      if (consulta.dataSolicitacao) {
        builder.where((builderPref) => {
          builderPref
            .where("dt_solicitacao", ">=", moment(consulta.dataSolicitacao.inicio).format(DATABASE_DATETIME_INPUT))
            .where("dt_solicitacao", "<=", moment(consulta.dataSolicitacao.fim).format(DATABASE_DATETIME_INPUT));
        });
      }
    } else {
      if (consulta.protocolo) {
        builder.where((builderPref) => (
          builderPref.where("protocolo", consulta.protocolo.protocolo)
        ));
      }
    }
  }
}

module.exports = SolicitacoesRepository;