export function configEtapas(etapas) {
  const config = etapas.map((item) => ({
    title: item.nome,
  }));
  return config;
}

export function getManifestacoesAnteriores(manifestacoes) {
  const manifestacoesInfoReduzida = manifestacoes?.map((manifestacao) => ({
    prefixo: manifestacao.prefixo,
    nomePrefixo: manifestacao.nomePrefixo,
    acaoId: manifestacao.acao.id,
    situacaoId: manifestacao.situacao.id,
  }));
  const manifestacoesInfoReduzidaToString = manifestacoesInfoReduzida?.map(
    JSON.stringify,
  );
  const manifestacoesInfoReduzidaToStringUnico = new Set(
    manifestacoesInfoReduzidaToString,
  );
  const manifestacoesInfoReduzidaToObject = Array.from(
    manifestacoesInfoReduzidaToStringUnico,
  ).map(JSON.parse);
  return manifestacoesInfoReduzidaToObject;
}
