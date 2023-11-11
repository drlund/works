const _ = require('lodash');

const exception = use('App/Exceptions/Handler');

const Funci = use("App/Models/Mysql/Arh/Funci");
const Dipes = use("App/Models/Mysql/Dipes");
const Uors500g = use("App/Models/Mysql/Arh/Uors500g");

const getTreinamentosRealizados = use("App/Commons/Designacao/getTreinamentosRealizados");
const getNivelAlfab = use("App/Commons/Designacao/getNivelAlfab");

async function getOrigem(funci) {

  try {
    let orig = await Funci.query()
      .with('prefixoLotacao', (dbQuery) => {
        dbQuery
          .with('dadosDiretoria')
          .with('dadosSuper')
          .with('dadosGerev')
          .sb00()
      })
      .with('codUorLocalizacao', (dbQuery) => {
        dbQuery
          .with('dadosDiretoria')
          .with('dadosSuper')
          .with('dadosGerev')
      })
      .where('matricula', funci.funci)
      .first();

    orig = orig.toJSON();

    let origem = {
      matricula: orig.matricula,
      nome: orig.nome,
      prefixo_lotacao: orig.prefixo_lotacao,
      funcao_lotacao: orig.funcao_lotacao,
      ag_localiz: orig.ag_localiz,
      desc_func_lotacao: orig.desc_func_lotacao,
      cod_uor_grupo: orig.cod_uor_grupo,
      comissao: orig.comissao,
      cod_afr: orig.cod_afr,
      cod_uor_localizacao: orig.cod_uor_localizacao,
      cod_uor_trabalho: orig.cod_uor_trabalho,
      cd_super_juris: orig.prefixoLotacao.cd_super_juris,
      prefixo: orig.prefixoLotacao.prefixo,
      dependencia: orig.prefixoLotacao.nome,
      uor_dependencia: orig.prefixoLotacao.uor_dependencia,
      tip_dep: orig.prefixoLotacao.tip_dep,
      cd_subord_paa: orig.prefixoLotacao.cd_subord_paa,
      nivel_agencia: orig.prefixoLotacao.nivel_agencia,
      cd_municipio_ibge: orig.codUorLocalizacao.cd_municipio_ibge,
      dv_municipio_ibge: orig.codUorLocalizacao.dv_municipio_ibge,
      municipio: orig.codUorLocalizacao.municipio,
      nm_uf: orig.codUorLocalizacao.nm_uf,
    }

    if (orig.prefixoLotacao.cd_super_juris === '0000') {
      origem.nome_super = '';
    } else {
      origem.nome_super = orig.prefixoLotacao.dadosSuper.nome;
    }

    origem.nivel_alfab = await getNivelAlfab(parseInt(orig.prefixoLotacao.nivel_agencia));

    let uor500g = await Uors500g.findBy('CodigoUOR', parseInt(origem.uor_dependencia));

    uor500g = uor500g.toJSON();

    let municipio = await Dipes.query()
      .select('municipio', 'nm_uf', 'cd_municipio_ibge', 'dv_municipio_ibge')
      .table('mst606')
      .where('cd_municipio_bb', uor500g.CodigoMunicipio)
      .first();

    municipio = municipio.toJSON();

    origem.cd_municipio_ibge = municipio.cd_municipio_ibge;
    origem.dv_municipio_ibge = municipio.dv_municipio_ibge;
    origem.municipio = municipio.municipio;
    origem.nm_uf = municipio.nm_uf;

    origem.dependencia = orig.prefixoLotacao.nome;
    origem.cod_municipio_ibge = orig.prefixoLotacao.cd_municipio_ibge;

    origem.tip_dep = orig.prefixoLotacao.tip_dep === 15 ? 'PAA' : '';
    origem.cd_subord_paa = orig.prefixoLotacao.cd_subord_paa === '0000' ? '' : orig.prefixoLotacao.cd_subord_paa;

    origem.municipioUf = origem.municipio + '/' + origem.nm_uf;
    origem.cd_municipio_ibge_dv = origem.cd_municipio_ibge + origem.dv_municipio_ibge;

    origem.treinamentos = await getTreinamentosRealizados(origem.matricula);

    return origem;

  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getOrigem;
