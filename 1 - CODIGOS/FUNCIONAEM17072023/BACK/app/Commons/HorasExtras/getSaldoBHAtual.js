const exception = use("App/Exceptions/Handler");
const getDadosAdesaoHE = use("App/Commons/HorasExtras/getDadosAdesaoHE");

async function getSaldoBHAtual (matricula) {
  try {
    const dadosBHFunci = await getDadosAdesaoHE(matricula);

    return dadosBHFunci.dadosAdesao.saldo_horas;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = getSaldoBHAtual;