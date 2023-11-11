const {NIVEL_ALFAB} = use("App/Commons/Designacao/Constants");

function getNivelAlfab (nivel) {
  const chavesInt = Object.keys(NIVEL_ALFAB).map(chave => parseInt(chave));
  return chavesInt.includes(parseInt(nivel)) ? NIVEL_ALFAB[nivel] : '';
}

module.exports = getNivelAlfab;