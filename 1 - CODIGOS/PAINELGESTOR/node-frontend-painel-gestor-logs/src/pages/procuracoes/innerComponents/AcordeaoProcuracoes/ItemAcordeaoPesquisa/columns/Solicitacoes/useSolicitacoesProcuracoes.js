import { usePesquisaItemAcordeaoContext } from '../../PesquisaItemAcordeaoContext';

export function useSolicitacoesProcuracoes() {
  const { procuracao } = usePesquisaItemAcordeaoContext();

  return /** @type {{ id: number, cartorio: number | null, nome: string }[]} */(
    procuracao.flatMap(p => {
      if (p.procuracaoAgregada) {
        return {
          id: p.procuracaoAgregada.procuracaoId,
          cartorio: p.procuracaoAgregada.cartorioId,
          nome: p.outorgado.nome,
        };
      }

      return p.subsidiarias.map(s => ({
        id: s.procuracaoId,
        cartorio: s.cartorioId,
        nome: `${s.nome} - ${p.outorgado.nome}`,
      }));
    })
  );
}
