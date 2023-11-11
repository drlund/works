const exception = use('App/Exceptions/Handler');
const getDadosAdesaoHE = use("App/Commons/HorasExtras/getDadosAdesaoHE");
const getResumoGeral = use("App/Commons/HorasExtras/getResumoGeral");
const isSolicitacaoDespachavelFunci = use("App/Commons/HorasExtras/isSolicitacaoDespachavelFunci");
const {isPrefixoUT} = use("App/Commons/Arh");

async function getResumo(user, usuario, idSolicitacao, prefixo) {
  try {
    const tipoResumo = await isPrefixoUT(user.prefixo) ? 2 : 1;

    const [resumoGeralPrefixo, idProprioMes, solicitacao] = await getResumoGeral(user, tipoResumo, idSolicitacao, prefixo);
    const {dadosAdesao, ddComissao} = await getDadosAdesaoHE(usuario);
    const despachavel = idSolicitacao && idProprioMes && (solicitacao ? await isSolicitacaoDespachavelFunci(user, solicitacao) : true);

    const visoes = [
      {
        key: 0,
        visao: dadosAdesao.nome,
        nomeVisao: 'Visão Funcionário',
        solicitadas: dadosAdesao.Solicitado,
        autorizadas: dadosAdesao.Autorizado,
        realizadas: dadosAdesao.Realizado,
        mesAtual: dadosAdesao.mesAtual,
        proximoMes: dadosAdesao.proximoMes,
        horasAcumuladasTotal: dadosAdesao.saldoTotal
      }
    ]

    const visoesPrefixos = resumoGeralPrefixo.map((visao, key) => {
      return {
        key: key + 1,
        visao: visao.visao,
        nomeVisao: visao.NomeVisao || visao.nomeVisao,
        solicitadas: (visao.Solicitado || visao.solicitadas) || 0,
        autorizadas: (visao.Autorizado || visao.autorizadas) || 0,
        realizadas: (visao.Realizado || visao.realizadas) || 0,
        mesAtual: visao.mesAtual,
        proximoMes: visao.proximoMes,
        horasAcumuladasTotal: visao.horasAcumuladasTotal
      }
    })

    visoes.push(...visoesPrefixos);

    return {posicao: resumoGeralPrefixo.posicao, visoes, ddComissao, despachavel, dadosAdesao};
  } catch(err) {
    throw new exception(err, 400);
  }
}

module.exports = getResumo;