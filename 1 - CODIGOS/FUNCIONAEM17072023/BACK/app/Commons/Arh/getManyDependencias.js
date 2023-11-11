const dependenciaModel = use('App/Models/Mysql/Dependencia');
const pretifyDependencia = use('App/Commons/Arh/pretifyDependencia');
const exception = use('App/Exceptions/Handler');

async function getManyDependencias(prefixos){

    prefixo = prefixos.map( elem => String(elem).padStart(4, '0'));
    const dependencias = await dependenciaModel.query().select("mstd503e.EmaildaUOR as email","mst606.*").from("mst606")
        .innerJoin('mstd503e', 'mst606.uor_dependencia', 'mstd503e.CodigodaUOR')
        .whereIn("prefixo", prefixos ).where({cd_subord: "00"}).where("IndEmailPrincipal","S")
        .fetch();

    if(!dependencias){
      throw new exception("Dependências não encontradas.", 404);
    }

    return dependencias.rows.map((dependencia) => pretifyDependencia(dependencia));

  }

module.exports = getManyDependencias;