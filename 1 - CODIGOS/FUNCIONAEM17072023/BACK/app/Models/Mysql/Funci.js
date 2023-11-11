"use strict";

const Model = use("Model");

class Funci extends Model {
  static get computed() {
    return ["cargo"];
  }

  //CONFIG
  static get table() {
    return 'DIPES.arhfot01';
  }

  static get primaryKey() {
    return "matricula";
  }

  static get connection() {
    return "dipes";
  }

  static get incrementing() {
    return false;
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  static get visible() {
    return [
      "matricula",
      "nome",
      "email",
      "cpf_nr",
      "data_nasc",
      "data_posse",
      "grau_instr",
      "cod_func_lotacao",
      "desc_func_lotacao",
      "comissao",
      "desc_cargo",
      "cod_situacao",
      "data_situacao",
      "prefixo_lotacao",
      "desc_localizacao",
      "cod_uor_trabalho",
      "nome_uor_trabalho",
      "cod_uor_grupo",
      "nome_uor_grupo",
      "ddd_celular",
      "fone_celular",
      "sexo",
      "est_civil",
      "dt_imped_odi",
      "ag_localiz",
      "cargo",
      "nomePrefixo",
      "gerev",
      "super",
      "diretoria",
      "prefixo",
      "dt_imped_remocao",
      "dt_imped_comissionamento",
      "dt_imped_odi",
      "dt_imped_pas",
      "dt_imped_instit_relac",
      "dt_imped_demissao",
      "dt_imped_bolsa_estudos",
      "rg_emissor_uf",
    ];
  }

  dependencia() {
    return this.hasOne("App/Models/Mysql/Dependencia", "ag_localiz", "prefixo");
  }

  prefixo() {
    return this.hasOne("App/Models/Mysql/Prefixo", "ag_localiz", "prefixo");
  }

  nomeGuerra() {
    return this.hasOne("App/Models/Mysql/NomeGuerra", "matricula", "matricula");
  }

  estCivil() {
    return this.hasOne("App/Models/Mysql/Arh/arhEstadoCivil", "est_civil", "codigo");
  }

  dadosComissao() {
    return this.hasOne(
      "App/Models/Mysql/Arh/ComissoesFot06",
      "funcao_lotacao",
      "cod_comissao"
    );
  }

  // MUTATORS
  getNome(nome) {
    return nome.trim();
  }

  getCargo({ desc_cargo }) {
    return String(desc_cargo).trim();
  }
}

module.exports = Funci;
