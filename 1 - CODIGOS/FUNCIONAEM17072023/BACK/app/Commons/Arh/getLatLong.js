const exception = use('App/Exceptions/Handler');
const Designacao = use('App/Models/Mysql/Designacao');
const Superadm = use('App/Models/Mysql/Superadm');
const Dipes = use("App/Models/Mysql/Dipes");
const _ = require('lodash');

//Private methods
async function getLatLong( origem, destino ) {
  let dep, codMunicipioBB, codMunicipioIBGE;

  if (origem.cod_uor_pref_lotacao) {
    dep = await Dipes.query()
      .from("mstd500g")
      .where("CodigoUOR", origem.cod_uor_pref_lotacao)
      .first();

    if (!dep) {
      throw new exception("Dados do código uor não encontrados.", 404);
    }

    dep = dep.toJSON();

    if (!_.isNil(dep)) {
      codMunicipioBB = dep.CodigoMunicipio;
      codMunicipioIBGE = await Dipes.query()
        .distinct()
        .select("cd_municipio_ibge")
        .from("mst606")
        .where("cd_municipio_bb", codMunicipioBB)
        .first();

      if (!codMunicipioIBGE) {
        throw new exception("Dados do código uor não encontrados.", 404);
      }

      codMunicipioIBGE = (codMunicipioIBGE.toJSON()).cd_municipio_ibge;
    } else {
      codMunicipioIBGE = origem.cd_municipio_ibge;
    }

    let posOrigem = await Superadm.query()
      .from("Geo_Local")
      .where("Municipio_IBGE", codMunicipioIBGE)
      .first();

    if (!posOrigem) {
      throw new exception("Dados de localização da origem não encontrados.", 404);
    }

    posOrigem = posOrigem.toJSON();

    let posDestino = await Superadm.query()
      .from("Geo_Local")
      .where("Municipio_IBGE", destino.cd_municipio_ibge)
      .first();

    if (!posDestino) {
      throw new exception("Dados de localização da destino não encontrados.", 404);
    }

    posDestino = posDestino.toJSON();

    const pontosOrigemDestino = {
      latOrigem: posOrigem.LAT,
      longOrigem: posOrigem.LONG,
      latDestino: posDestino.LAT,
      longDestino: posDestino.LONG,
    }

    return pontosOrigemDestino;

  }
}

module.exports = getLatLong;
