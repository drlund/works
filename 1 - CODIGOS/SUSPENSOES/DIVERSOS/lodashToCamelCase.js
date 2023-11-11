/**
 * Neste exemplo, a função `_.camelCase` do lodash é usada para converter automaticamente os nomes das colunas para camel 
 * case no momento das consultas ao banco de dados. Isso permitirá que você use os nomes em camel case no frontend sem a 
 * necessidade de conversões adicionais. Certifique-se de instalar a biblioteca lodash no seu projeto, caso ainda não a 
 * tenha feito.
 * 
 * Para converter automaticamente os nomes de colunas com hífen para camel case no backend, você pode fazer uso de uma 
 * biblioteca como o lodash para fazer a conversão de forma programática. Aqui está um exemplo de como você pode aplicar 
 * essa conversão para os nomes de colunas no seu repositório:
 */

const _ = require('lodash');
const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");
const Matriculas = use("App/Models/Mysql/movimentacoes/Matriculas");
const TiposJurisdicoes = use("App/Models/Mysql/movimentacoes/TiposJurisdicoes");
const ParamSuspensaoView = use("App/Models/Mysql/movimentacoes/ParamSuspensaoView");
const ParamTipoSuspensao = use("App/Models/Mysql/movimentacoes/ParamTipoSuspensao");

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const paramVicePresi = await ParamSuspensao.query()
      .select("id")
      .select(_.camelCase("cd_vicepres_juris")) // Convertendo o nome da coluna para camel case
      .distinct(_.camelCase("tipo_suspensao")) // Convertendo o nome da coluna para camel case
      .distinct(_.camelCase("validade")) // Convertendo o nome da coluna para camel case
      .distinct(_.camelCase("matricula_responsavel")) // Convertendo o nome da coluna para camel case
      .where(_.camelCase("vice_presi"), "!=", 0) // Convertendo o nome da coluna para camel case
      .where("ativo", "1")
      .fetch();

    // Resto do código...

    return busca;
  }

  async getTiposJurisdicoes() {
    const vicePresiJuris = await TiposJurisdicoes.query()
      .select(_.camelCase("cd_vicepres_juris")) // Convertendo o nome da coluna para camel case
      .distinct(_.camelCase("cd_vicepres_juris")) // Convertendo o nome da coluna para camel case
      .where(_.camelCase("cd_vicepres_juris"), "!=", "0000") // Convertendo o nome da coluna para camel case
      .fetch();

    // Resto do código...

    return busca;
  }

  // Resto do código...
}

module.exports = ParametroSuspensaoRepository;
