namespace Procuracoes {
  namespace SolicitacoesLista {
    type FunciDependencia = {
      prefixo: string;
      nome: string;
      super: string;
      uf: string;
      municipio: string;
    };

    type FunciSolicitacoes = {
      matricula: string;
      nome: string;
      cargo: string;
      dependencia: FunciDependencia;
    };

    type ProcuracaoPedido = {
      id: number;
      dataEmissao: string;
      dataVencimento: string;
      dataRevogacao: string;
      dataManifesto: string;
      idCartorio: number;
      outorgado: FunciSolicitacoes;
    };

    type CartorioItem = {
      id: number;
      nome: string;
    };

    type ProcuracaoItem = {
      cartorio: CartorioItem | null;
      id: number;
      folha: string;
      livro: string;
      dataEmissao: string;
      dataVencimento: string;
      dataRevogacao: string;
      dataManifesto: string;
      outorgado: {
        matricula: string;
        nome: string;
      };
      subsidiarias: string[];
    };

    type SolicitacaoItem = {
      id: number;
      manifesto: number;
      copia: number;
      revogacao: number;
      matriculaRegistro: string;
      registroAt: string;
      procuracao: ProcuracaoItem;
    };

    type Pedido = {
      id: number;
      observacao: string;
      registroAt: string;
      procuracao: ProcuracaoPedido;
      funciRegistro: FunciSolicitacoes;
      solicitacaoItems: SolicitacaoItem[];
    };
  }

  namespace SolicitacoesListaCartorio {
    type ItemID = number;

    type ListaReturn = {
      [cartorioId: number]: {
        items: ItemID[],
        envelopes: {
          [prefixo: string]: {
            dados: {
              prefixo: string,
              nome: string,
              uf: string,
              municipio: string,
            },
            procuracoes: {
              [procuracaoId: number]: {
                info: {
                  folha: string,
                  livro: string,
                },
                pedido: {
                  copia: number,
                  revogacao: number,
                  manifesto: number,
                };
              };
            };
          };
        },
      };
    };
  }

  namespace SolicitacoesListaControle {
    type ListaControle = {
      id: number,
      pedidoOutorgadoMatricula: string | null,
      pedidoOutorgadoNome: string | null,
      pedidoOutorgadoDependenciaPrefixo: string | null,
      pedidoOutorgadoDependenciaNome: string | null,
      idProcuracao: number,
      outorgadoMatricula: string,
      outorgadoNome: string,
      idCartorioCusto: number,
      idSubsidiaria: number | null,
      nomeSubsidiaria: string | null,
      matriculaSent: string,
      sentAt: Date | string,
      matriculaRegistroPedido: string,
      registroPedidoAt: Date | string,
      prefixoCusto: string,
      manifesto: number,
      copia: number,
      revogacao: number,
      digital: boolean,
      fisica: boolean,
    };
  }
}
