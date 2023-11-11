import constantes from './constantes';

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

export function possoMeManifestar(manifestacoes, usuario, isMyPendencia) {
  /*  console.log('MANIFESTAÇÔES,', manifestacoes); */

  /*   console.log('isMyPendencia', isMyPendencia); */

  const pendenciaAtual = manifestacoes.find(
    (single) => single.situacao.id == 1,
  );

  //Verifica se é uma das que estão no array das minhas subordinadas
  const ehMinhaPendencia = pendenciaAtual?.prefixo.includes(
    usuario.prefixo_efetivo,
  );
  /*   console.log('è minha pendencia?', ehMinhaPendencia); */

  //Testar
  if (ehMinhaPendencia) {
    const previousRegistrada = manifestacoes.find(
      (el) =>
        el.ordemManifestacao === pendenciaAtual.ordemManifestacao - 1 &&
        (el.situacao.id == constantes.situacaoRegistrada ||
          el.situacao.id == constantes.situacaoDispensada),
    );

    if (previousRegistrada) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
