/**
 * Para fazer a consulta da forma que você deseja no AdonisJS 4.1, precisamos utilizar o método `selectRaw()` 
 * para criar expressões SQL personalizadas. Além disso, precisamos utilizar os métodos `as()` para renomear 
 * os campos retornados na consulta. 
 * 
 * Neste código, utilizamos o método `selectRaw()` para criar expressões SQL personalizadas que correspondem 
 * aos campos que você deseja retornar na consulta. Também utilizamos o método `select()` para selecionar o 
 * campo `validade` da tabela sem renomeá-lo, e utilizamos o método `as()` para renomear os campos `vicePresi`, 
 * `diretoria`, `super`, `gerev`, `prefixo` e `matricula` como `Valor`, de acordo com a sua especificação. 
 * 
 * Com essas alterações, sua consulta deve funcionar conforme desejado no AdonisJS 4.1. Certifique-se de que 
 * o modelo `ParamSuspensao` esteja corretamente configurado e que os campos e tabelas estejam definidos 
 * corretamente para evitar outros erros.
 * 
 * Abaixo está o código atualizado da sua repository:
*/

"use strict";

const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const paramVicePresi = await ParamSuspensao.query()
      .selectRaw("'Vice Presidencia' as Tipo")
      .selectRaw("`vicePresi` as Valor")
      .selectRaw("`tipoSuspensao` as TipoSuspensao")
      .select("validade as Validade")
      .where("vicePresi", "!=", "0")
      .fetch();

    const paramDiretoria = await ParamSuspensao.query()
      .selectRaw("'Unidade Estratégica' as Tipo")
      .selectRaw("`diretoria` as Valor")
      .selectRaw("`tipoSuspensao` as TipoSuspensao")
      .select("validade as Validade")
      .where("diretoria", "!=", "0")
      .fetch();

    const paramSuper = await ParamSuspensao.query()
      .selectRaw("'Unidade Tática' as Tipo")
      .selectRaw("`super` as Valor")
      .selectRaw("`tipoSuspensao` as TipoSuspensao")
      .select("validade as Validade")
      .where("super", "!=", "0")
      .fetch();

    const paramGerev = await ParamSuspensao.query()
      .selectRaw("'Super Comercial' as Tipo")
      .selectRaw("`gerev` as Valor")
      .selectRaw("`tipoSuspensao` as TipoSuspensao")
      .select("validade as Validade")
      .where("gerev", "!=", "0")
      .fetch();

    const paramPrefixo = await ParamSuspensao.query()
      .selectRaw("'Prefixo' as Tipo")
      .selectRaw("`prefixo` as Valor")
      .selectRaw("`tipoSuspensao` as TipoSuspensao")
      .select("validade as Validade")
      .where("prefixo", "!=", "0")
      .fetch();

    const paramMatricula = await ParamSuspensao.query()
      .selectRaw("'Matricula' as Tipo")
      .selectRaw("`matricula` as Valor")
      .selectRaw("`tipoSuspensao` as TipoSuspensao")
      .select("validade as Validade")
      .where("matricula", "!=", "0")
      .fetch();

    const busca = {
      paramVicePresi: paramVicePresi ? paramVicePresi.toJSON() : [],
      paramDiretoria: paramDiretoria ? paramDiretoria.toJSON() : [],
      paramSuper: paramSuper ? paramSuper.toJSON() : [],
      paramGerev: paramGerev ? paramGerev.toJSON() : [],
      paramPrefixo: paramPrefixo ? paramPrefixo.toJSON() : [],
      paramMatricula: paramMatricula ? paramMatricula.toJSON() : [],
    };

    return busca;
  }

  /**
   * @param {{save: () => string;}} novaSuspensao
   */
  async gravarSuspensao(novaSuspensao) {
    await novaSuspensao.save();

    return novaSuspensao;
  }
}

module.exports = ParametroSuspensaoRepository;
