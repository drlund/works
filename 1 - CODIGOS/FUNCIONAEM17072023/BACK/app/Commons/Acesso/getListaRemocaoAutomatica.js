"use strict";

const Superadm = require("../../Models/Mysql/Superadm");

const Funci = use("App/Models/Mysql/Arh/Funci");
const Prefixo = use("App/Models/Mysql/Arh/Prefixo");
const Mstd500g = use("App/Models/Mysql/Arh/Mstd500g");
const CargosComissoes = use("App/Models/Mysql/Arh/CargosComissoes");

const moment = use("App/Commons/MomentZoneBR");

async function getListaRemocaoAutomatica(concessoes) {
  // Dentro do loop, verificar cada objeto de acesso e colocá-lo
  // em cada item de identificador
  const matriculas = concessoes.map((acesso) => acesso.identificador);

  const lista = [...new Set(matriculas)];

  const dadosIdentificadores = await _getNomesMatriculas(lista);

  // ! Incompleto: criar array com funcis inexistentes
  const idsArh = concessoes
    .filter((item) => {
      if (item.identificador === "F0000000") {
        return false;
      }
      return !dadosIdentificadores.some(
        (elem) => elem.identificador === item.identificador
      );
    })
    .map((concessao) => concessao._id);

  // ! Incompleto: criar array com prefixos alterados
  const idsMst = concessoes
    .filter((item) => {
      if (!item.prefixo) {
        return false;
      }
      return dadosIdentificadores.some(
        (elem) => elem.identificador === item.identificador && elem.prefixo !== item.prefixo
      );
    })
    .map((concessao) => concessao._id);

  return [idsArh, idsMst];
}

// Métodos privados

async function _getNomesMatriculas(identificador) {
  if (Array.isArray(identificador) && !identificador.length) {
    return [];
  }
  const funcisENomes = await Funci.query()
    .select(
      "matricula as identificador",
      "nome as nomeIdentificador",
      "ag_localiz as prefixo"
    )
    .whereIn("matricula", identificador)
    .fetch();

  return funcisENomes.toJSON();
}

module.exports = getListaRemocaoAutomatica;
