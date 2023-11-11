'use strict'

const CtrlDiscp = use("App/Models/Mysql/CtrlDisciplinar/CtrlDiscp");
const Gedip = use("App/Models/Mysql/CtrlDisciplinar/Gedip");
const Dipes = use("App/Models/Mysql/Dipes");
const Prefixo = use("App/Models/Mysql/Prefixo");
const FunciResp = use("App/Models/Mysql/CtrlDisciplinar/FunciResp");
const Medida = use("App/Models/Mysql/CtrlDisciplinar/Medida");
const AcoesGestores = use("App/Models/Mysql/CtrlDisciplinar/AcoesGestores");
const Acao = use("App/Models/Mysql/CtrlDisciplinar/Acao");
const Comite = use("App/Models/Mysql/CtrlDisciplinar/Comite");
const Superadm = use("App/Models/Mysql/Superadm");
const moment = require('moment');
const { DeleteFile } = use('App/Commons/CtrlDisciplinar/Files');

const { FunciRespMail } = use('App/Commons/CtrlDisciplinar/Mail');

const exception = use("App/Exceptions/Handler");

const _ = require('lodash');
const { result } = require('lodash');

const GedipPerm = async ({ prefixo }) => {
  const all = await Gedip
    .query()
    .table('gedips')
    .where('prefixo_inclusao_gedip', prefixo)
    .fetch();
  return all.toJSON();
}

const GedipGestor = async ({ chave }) => {
  const all = await CtrlDiscp
    .query()
    .from('gedips as gd')
    .leftJoin('funci_resps as fr', 'gd.id_gedip', 'fr.id_gedip')
    .where('fr.chave_funci_resp', chave)
    .where('gd.ativo', 1)
    .where('status_gedip', '<>', 2)
    .where('status_gedip', '<>', 5)
    .fetch();
  return all.toJSON();
}

const GedipShow = async ({ params }) => {

  try {

    _.isNil(params.id) ? params.id = params.id_gedip : null;

    let results = Gedip.query()
      .with('func_gedip', builder => {
        builder
          .with('prefixo')
          .with('nomeGuerra')
      })
      .with('func_inclusao_gedip', builder => {
        builder
          .with('prefixo')
          .with('nomeGuerra')
      })
      .with('func_alteracao_gedip', builder => {
        builder
          .with('prefixo')
          .with('nomeGuerra')
      })
      .with('pref_inclusao_gedip')
      .with('comite')
      .with('medida')
      .with('funci_resp', builder => {
        builder
          .with('funcionario_resp', builder => {
            builder
              .with('prefixo')
              .with('nomeGuerra')
          })
      })
      .with('docs', builder => {
        builder
          .with('acao')
      })
      .with('status')

    if (params.tipo === 1) {
      results.where('ativo', 1)
        .orWhere((builder) => {
          builder
            .where('ativo', 0)
            .where('dt_conclusao', '>', moment().subtract(5, 'days').format("YYYY-MM-DD"));
        })
    }
    if (params.tipo === 2) {
      results.where('prefixo_inclusao_gedip', params.prefixo)
        .where('ativo', 1);
    }
    if (params.tipo === 3) {
      results.where('ativo', 1)
        .whereNotIn('status_gedip', [2, 5])
        .whereHas('funci_resp')
    }

    if (params.id) {
      results.where('id_gedip', params.id)
      results = await results.first();
    } else {
      results = await results.fetch();
    }

    results = results.toJSON();

    if (params.isGestor && params.tipo === 3) {
      results = results.filter(res => res.funci_resp.chave_funci_resp === params.user.chave);
    }

    const resultado = (result) => {

      result.sexo_funci = result.sexo;
      delete result.sexo;


      // dados funcionario_gedip
      if (result.funcionario_gedip && !!result.func_gedip) {
        result.funcionario_gedip_nome = result.func_gedip.nome;
        result.funcionario_gedip_prefixo = result.func_gedip.prefixo.prefixo;
        result.funcionario_gedip_prefixo_nome = result.func_gedip.prefixo.nome;
        result.funcionario_gedip_municipio = result.func_gedip.prefixo.municipio;
        result.funcionario_gedip_uf = result.func_gedip.prefixo.nm_uf;
      } else {
        result.funcionario_gedip_nome = '';
        result.funcionario_gedip_prefixo = '';
        result.funcionario_gedip_prefixo_nome = '';
        result.funcionario_gedip_municipio = '';
        result.funcionario_gedip_uf = '';
      }

      if (result.funci_inclusao_gedip && !!result.func_inclusao_gedip) {
        result.funci_inclusao_gedip_nome = result.func_inclusao_gedip.nome;
        result.funci_inclusao_gedip_prefixo = result.func_inclusao_gedip.prefixo.prefixo;
        result.funci_inclusao_gedip_prefixo_nome = result.func_inclusao_gedip.prefixo.nome;
        result.funci_inclusao_gedip_municipio = result.func_inclusao_gedip.prefixo.municipio;
        result.funci_inclusao_gedip_uf = result.func_inclusao_gedip.prefixo.nm_uf;
      } else {
        result.funci_inclusao_gedip_nome = '';
        result.funci_inclusao_gedip_prefixo = '';
        result.funci_inclusao_gedip_prefixo_nome = '';
        result.funci_inclusao_gedip_municipio = '';
        result.funci_inclusao_gedip_uf = '';
      }

      if (result.funci_alteracao_gedip && !!result.func_alteracao_gedip) {
        result.funci_alteracao_gedip_nome = result.func_alteracao_gedip.nome;
        result.funci_alteracao_gedip_prefixo = result.func_alteracao_gedip.prefixo.prefixo;
        result.funci_alteracao_gedip_prefixo_nome = result.func_alteracao_gedip.prefixo.nome;
        result.funci_alteracao_gedip_municipio = result.func_alteracao_gedip.prefixo.municipio;
        result.funci_alteracao_gedip_uf = result.func_alteracao_gedip.prefixo.nm_uf;
      } else {
        result.funci_alteracao_gedip_nome = '';
        result.funci_alteracao_gedip_prefixo = '';
        result.funci_alteracao_gedip_prefixo_nome = '';
        result.funci_alteracao_gedip_municipio = '';
        result.funci_alteracao_gedip_uf = '';
      }

      if (result.funci_resp) {
        result.id_funci_resp = result.funci_resp.id_funci_resp;
        result.chave_funci_resp = result.funci_resp.chave_funci_resp;
        result.prefixo_resp = result.funci_resp.prefixo_resp;
        result.comissao_funci_resp = result.funci_resp.desc_cargo;
        if (result.funci_resp.funcionario_resp) {
          result.nome_funci_resp = result.funci_resp.funcionario_resp.nome;
          result.sexo_funci_resp = result.funci_resp.funcionario_resp.sexo;
          result.nome_prefixo_resp = result.funci_resp.funcionario_resp.desc_localizacao;
          result.email_funci_resp = result.funci_resp.funcionario_resp.email;
        }
      }

      result.nm_medida = result.medida.nm_medida;

      result.nm_comite = result.comite.nm_comite;

      //result.docs
      result.id_acaogest = result.docs
      result.id_acao = result.docs

      result.nm_status = result.status.nm_acao;

      result.isGestor = params.isGestor;

      return result;
    }

    results = params.id ? resultado(results) : results.map(result => resultado(result));

    return results;
  } catch (err) {
    throw new exception(err);
  }
}

const FunciRespNew = async ({ funciEnv, id_gedip }) => {
  try {
    let admin = await Superadm.query()
      .select('flag_administrador')
      .from('cargos_e_comissoes')
      .where('cd_funcao', funciEnv.comissao)
      .fetch();

    admin = (admin.toJSON())[0];

    let prefResp;

    if (admin.flag_administrador) {
      prefResp = await CtrlDiscp.query()
        .select('prefixo_pai as prefixo')
        .from('tb_jurisdicoes')
        .where('prefixo_filha', '=', funciEnv.prefixoLotacao)
        .fetch();

      prefResp = (prefResp.toJSON())[0];
    } else {
      prefResp = { prefixo: funciEnv.prefixoLotacao };
    }

    let comissoes = await Superadm.query()
      .select('cd_funcao')
      .from('cargos_e_comissoes')
      .where('flag_administrador', 1)
      .fetch();

    comissoes = comissoes.toJSON();

    let listaComisoes = [];
    for (let [key, value] of Object.entries(comissoes)) {
      listaComisoes.push(value.cd_funcao);
    }

    let funciResp = await Dipes.query()
      .select('matricula', 'nome', 'comissao', 'sexo', 'desc_cargo', 'email')
      .table('arhfot01_adm')
      .where('ag_localiz', prefResp.prefixo)
      .whereIn('comissao', listaComisoes)
      .fetch();

    funciResp = (funciResp.toJSON())[0];

    if (funciResp) {

      let dadosFunciResp = {
        chave_funci_resp: funciResp.matricula,
        prefixo_resp: prefResp.prefixo,
        sexo: funciResp.sexo,
        desc_cargo: funciResp.desc_cargo
      };

      if (id_gedip) {
        dadosFunciResp.id_gedip = id_gedip;
        await FunciResp.create(dadosFunciResp);
      }

      return funciResp;

    }
  } catch (err) {
    throw new exception(err);
  }
}

const AddAcao = async ({ dadosGedip, id_acao, dadosUsuario }) => {

  try {
    const acoesGestores = await AcoesGestores.query()
      .insert({ id_gedip: dadosGedip.id_gedip, id_acao: id_acao, funci: dadosUsuario.chave });

    const gedip = await Gedip.findByOrFail('id_gedip', dadosGedip.id_gedip);
    const data = { status_gedip: id_acao };
    gedip.merge(data);
    await gedip.save();

    return !!acoesGestores && !!gedip;
  } catch (err) {
    throw new exception(err);
  }
}

const ReativarGedip = async ({ params }) => {
  try{
    const gedip = await Gedip.findByOrFail('id_gedip', id);

    const data = { ativo: 1, dt_conclusao: null, documento: 0 };

    gedip.merge(data);

    await gedip.save();

    return gedip;
  } catch (err) {
    throw new exception(err);
  }

}

const SetDocEnviado = async (id, name) => {
  try {
    const gedip = await Gedip.findByOrFail('id_gedip', id);
    const data = { ativo: 0, dt_conclusao: moment(), documento: name };

    gedip.merge(data);

    await gedip.save();

    return gedip;
  } catch (err) {
    throw new exception(err);
  }
}

const GetBulkGedips = async (acao) => {
  try {
    const opcoes = [
      {
        acao: 'email',
        funcao: (builder) => {
          builder.where('ativo', 1)
            .whereNull('dt_conclusao')
        }
      },
      {
        acao: 'reset',
        funcao: (builder) => {
          builder.where('documento', '<>', '')
        }
      },
      {
        acao: 'cancelar',
        funcao: (builder) => {
          builder.where('ativo', 1)
            .whereNull('dt_conclusao')
        }
      }
    ];

    const funct = _.head(opcoes.filter(a => a.acao === acao));

    let gedips = await Gedip.query()
      .where(funct.funcao)
      .with('medida')
      .with('func_gedip')
      .fetch();

    if (gedips) {
      gedips = gedips.toJSON();
      gedips = gedips.filter(gedip => !_.isNil(gedip.func_gedip));
      gedips = gedips.map(a => ({ ...a, key: a.id_gedip }));
    }

    return gedips;

  } catch (err) {
    throw new exception(err);
  }

}

const SetBulkGedips = async (ids, acao) => {
  try {
    const opcoes = {
      email: async (ids) => {
        const ENVIO_COBRANCA = 2;

        let envEmail = ids.map(async (id) => {
          const gedip = await GedipShow({ params: { id } });
          return await FunciRespMail({ gedip, tipoEmail: ENVIO_COBRANCA });
        })

        envEmail = await Promise.all(envEmail);

        return envEmail;

      },
      reset: async (ids) => {

        let deleting = ids.map(async (id) => {
          const del = await DeleteFile(id);
          return del;
        });

        deleting = await Promise.all(deleting);

        return deleting;
      },

      cancelar: async (ids) => {

        let gedips = ids.map(async (id) => {

          await DeleteFile(id);
          const gedip = await Gedip.findBy('id_gedip', id);

          gedip.ativo = 0;
          await gedip.save()

          return gedip;

        })

        return gedips;
      }
    };

    await opcoes[acao](ids);

    let gedipsAjust = await Gedip.query()
      .select('nm_gedip')
      .whereIn('id_gedip', ids)
      .fetch();

    gedipsAjust = gedipsAjust.toJSON();

    return gedipsAjust.map(gedip => gedip.nm_gedip);

  } catch (err) {
    throw new exception(err);
  }
}

const CompGedip = async (dados) => {
  try {
    const gedip = await Gedip.findByOrFail('id_gedip', dados.id_gedip);

    const agenciaCC = await Prefixo.find(dados.prefixoCompar.age_apresentacao);
    const prefixoCompar = await Prefixo.find(dados.prefixoCompar.age_apresentacao);

    dados.agenciaCC = {...dados.agenciaCC, ...agenciaCC.toJSON()};
    dados.prefixoCompar = {...dados.prefixoCompar, ...prefixoCompar.toJSON()};

    let alineas = dados.alineas_clt;

    if (alineas.length > 1) {
      const ultimo = alineas.pop();
      alineas = alineas.toString().replace(/[a-zA-Z]+/g, '"$&"').replace(/,/g, ', ').concat(` e "${ultimo}"`);
    } else {
      alineas = alineas.toString();
    }

    dados.alineas_clt = alineas;

    gedip.observacoes_gedip = JSON.stringify({...dados});

    await gedip.save();

    return gedip;
  } catch (err) {
    throw new exception(err);
  }
}

module.exports = {
  GedipPerm,
  GedipGestor,
  GedipShow,
  FunciRespNew,
  AddAcao,
  ReativarGedip,
  SetDocEnviado,
  GetBulkGedips,
  SetBulkGedips,
  CompGedip
}
