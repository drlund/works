const Superadm = use("App/Models/Mysql/Superadm");
const _ = require('lodash');
const Constantes = use("App/Templates/Designacao/Constantes");
const exception = use('App/Exceptions/Handler');

async function limitrofes(origem, destino) {

  const regiaoMetrop = await _metropolitana(origem, destino);

  let codLimit = await Superadm.query()
    .select("munlim.cod_limitrofe")
    .from("app_designacao_munic_limitrofe AS munlim")
    .where("cod", origem.cd_municipio_ibge_dv)
    .fetch();

  if (!codLimit) {
    throw new exception("Não foi possível verificar o código da região metropolitana do municipio de origem", 400, "COD_LIMITROFE_NOT_FOUND");
  }

  codLimit = codLimit.toJSON();

  const munOrigem = codLimit.map(elem => elem.cod_limitrofe);

  if (_.size(munOrigem.filter(elem => elem === String(destino.cd_municipio_ibge_dv))) || destino.cd_municipio_ibge === origem.cd_municipio_ibge || regiaoMetrop) {
    return ({limitrofes: true, texto: Constantes.LIMITROFE })
  }

  return ({limitrofes: false, texto: Constantes.NAO_LIMITROFE })

}

async function _metropolitana (origem, destino) {

  let metrop = await Superadm.query()
    .select("regmet.nome_rm")
    .from("app_designacao_regiao_metropol AS regmet")
    .whereIn("regmet.cod_mun", [origem.cd_municipio_ibge_dv, destino.cd_municipio_ibge_dv])
    .fetch()

  if (!metrop) {
    throw new exception("Não foi possível calcular se municípios são limítrofes", 400, "LIMITROFE_NOT_FOUND");
  }

  metrop = metrop.toJSON();

  if (_.size(metrop) === 2) {
    return metrop[0].nome_rm === metrop[1].nome_rm
  }

  return false;
}

module.exports = limitrofes;