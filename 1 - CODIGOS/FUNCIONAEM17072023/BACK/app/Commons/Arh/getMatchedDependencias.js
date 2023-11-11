const dependenciaModel = use('App/Models/Mysql/Dependencia');
const pretifyDependencia = use('App/Commons/Arh/pretifyDependencia');

const exception = use('App/Exceptions/Handler');

/**
 * Método utilitário para consultar dados de prefixos, consultando por partes do nome ou do número do prefixo.
 *
 * @param {*} prefixo número do prefixo (pode ser incompleto) ou nome da dependência (pode ser incompleto)
 */

async function getMatchedDependencias(prefixo){

    const dependencias = await dependenciaModel.query().select("mstd503e.EmaildaUOR as email","mst606.*").from("mst606")
        .innerJoin('mstd503e', 'mst606.uor_dependencia', 'mstd503e.CodigodaUOR')
        .where({cd_subord: "00"}).where("IndEmailPrincipal","S").where("dt_encerramento", ">", "NOW()")
        .where(function() {
          this
            .where('prefixo', 'like', `%${prefixo}%`)
            .orWhere('nome', 'like', `%${prefixo}%`)
        })
        .fetch();

    if(!dependencias){
      throw new exception("Dependências não encontradas.", 404, 'DEPENDENCIA_NOT_FOUND');
    }

    return dependencias.rows.map((dependencia) => pretifyDependencia(dependencia));

  }

module.exports = getMatchedDependencias;