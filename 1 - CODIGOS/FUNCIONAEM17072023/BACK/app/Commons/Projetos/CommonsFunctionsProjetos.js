/**
 * Recebe uma data tipo moment com hora e retorna
 * @param {*} dataInicial
 */ 
async function transformaData(dataInicial) {

  // trocar o dia e o mês de posição para que a comparação do moment funcione
  const [dia, mes, ano_hora] = dataInicial.split('/');
  const dataFormatada = `${mes}/${dia}/${ano_hora}`;

  // const arrayInicio = dataInicial.split("/");
  // const dataFormatada = moment([
  //   arrayInicio[2].substring(0, 4),
  //   arrayInicio[1] - 1,
  //   arrayInicio[0],
  // ]);
  return dataFormatada;
}

module.exports = transformaData;
