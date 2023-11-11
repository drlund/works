/**
 * O erro ocorre porque o relacionamento "tipoSuspensao" não foi definido no modelo `ParamSuspensao`. Para corrigir isso, 
 * você precisará definir o relacionamento entre os modelos.
 * 
 * Supondo que você tem outro modelo chamado `TipoSuspensao` que representa a tabela relacionada, siga as etapas abaixo 
 * para definir o relacionamento corretamente:
 * 
 * 1. No modelo `ParamSuspensao`, defina o relacionamento com o modelo `TipoSuspensao`. Certifique-se de importar o modelo 
 * `TipoSuspensao` no início do arquivo:
*/

"use strict";

const Model = use("Model");
const TipoSuspensao = use("App/Models/Mysql/movimentacoes/TipoSuspensao");

class ParamSuspensao extends Model {
  static boot() {
    super.boot();
  }

  tipo() {
    return this.belongsTo(TipoSuspensao, "tipoSuspensao", "id");
  }
}

module.exports = ParamSuspensao;


/**
 * 2. Depois de definir o relacionamento no modelo, modifique o método `getSuspensoes` novamente para incluir o 
 * relacionamento na consulta:
 */

async getSuspensoes() {
  const suspensaoData = await ParamSuspensao.query()
    .select(
      "vicePresi as TIPO",
      "vicePresi as VALORES",
      "tipoSuspensao as TIPOSUSPENSAO",
      "validade as VALIDADE",
      "matriculaResponsavel as MATRICULARESPONSAVEL",
      "observacao as OBSERVACAO"
    )
    .where("vicePresi", "!=", "0")
    .orWhere("diretoria", "!=", "0")
    .orWhere("super", "!=", "0")
    .orWhere("gerev", "!=", "0")
    .orWhere("prefixo", "!=", "0")
    .orWhere("matricula", "!=", "0")
    .with("tipo")
    .fetch();

  return suspensaoData.toJSON();
}

/**
 * 3. Certifique-se de importar o modelo `ParamSuspensao` corretamente em seu repositório antes de usá-lo:
*/
const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");
