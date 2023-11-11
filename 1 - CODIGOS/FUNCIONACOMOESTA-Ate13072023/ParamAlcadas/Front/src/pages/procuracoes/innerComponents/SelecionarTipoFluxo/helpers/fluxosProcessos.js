const cadastro = /** @type {unique symbol} */ Symbol('cadastro');
const minuta = /** @type {unique symbol} */ Symbol('minuta');
const massificadoMinuta = /** @type {unique symbol} */ Symbol('massificado/minuta');
const massificadoCadastro = /** @type {unique symbol} */ Symbol('massificado/cadastro');

export const fluxosProcessos = /** @type {const} */({
  cadastro,
  minuta,
  massificadoMinuta,
  massificadoCadastro,
});

/**
 * @param {FluxosProcessos[keyof FluxosProcessos]} processo
 * @returns {processo is OneFluxoProcesso}
 */
export function verificarProcesso(processo) {
  if (processo === null
    || processo === undefined
    || Object.values(fluxosProcessos).includes(processo) === false
  ) {
    throw new Error('Processo invalido');
  }

  return true;
}

/**
 * @typedef {typeof fluxosProcessos} FluxosProcessos
 * @typedef {FluxosProcessos[keyof FluxosProcessos]} OneFluxoProcesso
 */
