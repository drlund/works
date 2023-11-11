export const getPercentualAtingimento = (criticidade) => {
  const percentual = criticidade.componentes.reduce(
    (acumulador, atual) => acumulador + atual.percAtingComponente,
    0,
  ) / criticidade.componentes.length;
  return parseFloat(parseFloat(percentual).toFixed(1));
};
