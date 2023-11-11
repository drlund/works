'use strict'

const { REGEX_ACESSO, TAMANHOS_TIPOS } = use('App/Commons/Acesso/Constants');

const {
  PREFIXOS,
  UORS,
  MATRICULAS,
  COMITES,
  COMISSOES,
  RFOS,
} = REGEX_ACESSO;

function aplicaRegexAcessos(tipo, identificador) {
  const result = Object.entries(TAMANHOS_TIPOS).filter((item) => item[0] === tipo);
  const [[,tamanho]] = result;
  let id = null;

  switch (tipo) {
    case 'comite':
      if (!COMITES.test(identificador)) {
        if (!PREFIXOS.test(identificador)) {
          id = String(identificador).padStart(TAMANHOS_TIPOS.prefixo, '0');
        }
        id = `C${identificador}`;
      }
      break;
    case 'rfo':
      if (RFOS.test(identificador)) {
        id = `${identificador}`;
      }
      break;
    default:
      id = String(identificador).padStart(tamanho, '0');
  }

  return id ? String(id).toUpperCase() : null;
}

module.exports = aplicaRegexAcessos;