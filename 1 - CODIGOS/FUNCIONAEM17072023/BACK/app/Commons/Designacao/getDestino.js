const _ = require('lodash');

const exception = use('App/Exceptions/Handler');

const Superadm = use('App/Models/Mysql/Superadm');
const Dipes = use("App/Models/Mysql/Dipes");
const Prefixo = use("App/Models/Mysql/Prefixo");
const Funci = use("App/Models/Mysql/Arh/Funci");
const Uors500g = use("App/Models/Mysql/Arh/Uors500g");

const Constants = use("App/Commons/Designacao/Constants");
const getNivelAlfab = use("App/Commons/Designacao/getNivelAlfab");

const getCPAFuncao = use('App/Commons/Arh/getCPAFuncao');

async function getDestino(vaga) {
  try {
    let dest = Prefixo.query()
      .with('dadosSuper')
      .with('dadosDiretoria')
      .with('dadosGerev')
      .where('prefixo', vaga.prefixo)
      .where("cd_subord", '00');

    if (vaga.funcao) {
      dest.innerJoin("DIPES.arhfot06", "arhfot06.cod_comissao", "arhfot06.cod_comissao")
        .innerJoin("DIPES.arhfot05", "arhfot05.cod_comissao", "arhfot05.cod_comissao")
        .where("arhfot06.cod_comissao", vaga.funcao)
        .where("arhfot05.cod_comissao", vaga.funcao);
    }

    dest = await dest.first();

    dest = dest.toJSON();




    let destino = {
      cd_super_juris: dest.cd_super_juris,
      nome: dest.nome,
      cod_comissao: dest.cod_comissao || '',
      nome_comissao: dest.nome_comissao || '',
      prefixo: dest.prefixo,
      dependencia: dest.nome,
      uor_dependencia: dest.uor_dependencia,
      tip_dep: dest.tip_dep,
      cd_subord_paa: dest.cd_subord_paa,
      nivel_agencia: dest.nivel_agencia,
      cd_municipio_ibge: dest.cd_municipio_ibge,
      municipio: dest.municipio,
      nm_uf: dest.nm_uf,
      valor_referencia: dest.valor_referencia
    }

    destino.nivel_alfab = await getNivelAlfab(parseInt(dest.nivel_agencia));
    const existeVagaNaFuncao = !_.isNil(vaga.funci) && vaga.funci !== 'F0000000';

    if (existeVagaNaFuncao) {

      let funci = await Funci.query()
        .with("agLocaliz")
        .with("prefixoLotacao")
        .with("codUorLocalizacao")
        .with("codUorLocalizacao2")
        .with("uorTrabalho")
        .with("codUorTrabalho")
        .where('matricula', vaga.funci)
        .first();

      funci = funci.toJSON();

      let uor500g = await Uors500g.findBy('CodigoUOR', parseInt(funci.uor_trabalho));

      uor500g = uor500g.toJSON();

      let municipio = await Dipes.query()
        .select('municipio', 'nm_uf', 'cd_municipio_ibge', 'dv_municipio_ibge')
        .table('mst606')
        .where('cd_municipio_bb', uor500g.CodigoMunicipio)
        .first();

      municipio = municipio.toJSON();

      destino.cd_municipio_ibge = municipio.cd_municipio_ibge;
      destino.dv_municipio_ibge = municipio.dv_municipio_ibge;
      destino.municipio = municipio.municipio;
      destino.nm_uf = municipio.nm_uf;

    } else {
      destino.cd_municipio_ibge = dest.cd_municipio_ibge;
      destino.dv_municipio_ibge = dest.dv_municipio_ibge;
      destino.municipio = dest.municipio;
      destino.nm_uf = dest.nm_uf;
    }

    // destino.funci = vaga.funci;
    // destino.nomeFunci = vaga.funciNome;
    // destino.ausencias = vaga.ausencias;
    // destino.total_ausencias = vaga.diasAusencia;
    // destino.optbasica = vaga.motivo;

    destino.nome_super = dest.cd_super_juris === '0000' ? '' : dest.dadosSuper.nome;
    destino.tip_dep = dest.tip_dep === 15 ? 'PAA' : '';
    destino.cd_subord_paa = dest.cd_subord_paa === '0000' ? '' : dest.cd_subord_paa;

    destino.municipioUf = destino.municipio + '/' + destino.nm_uf;
    destino.cd_municipio_ibge_dv = destino.cd_municipio_ibge + destino.dv_municipio_ibge;

    if (vaga.funcao) {

      const { cpa, cpaLista } = await getCPAFuncao(vaga.funcao, dest.cd_diretor_juris);

      destino.cpa = [...cpa];
      destino.cpaLista = [...cpaLista];
    }

    return destino;



  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getDestino;
