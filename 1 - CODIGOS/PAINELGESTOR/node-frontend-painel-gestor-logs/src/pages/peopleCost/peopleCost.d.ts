namespace PeopleCost {
  type PesquisaOk = {
    email: string,
    matricula: string;
    nome: string;
    prefixo: string;
    prefixoNome: string;
    codCargo: string;
    cargo: string;
    valorReferencia: number;
    jornada: number;
    valorHora: number;
    valorMinuto: number;
    /** utilizado para page efficiency */
    projetoMinutos?: number;
  };

  type PesquisaError = {
    email: string;
    error: string;
  };

  type PesquisaLoading = {
    email: string;
    loading: boolean;
  };

  type PesquisaFetched = PesquisaError | PesquisaOk;
  type Pesquisa = PesquisaOk | PesquisaError | PesquisaLoading;

  type ListaEmails = {
    /** salva os funcis para uso */
    funcis: Record<string, PesquisaFetched>;
    /**  temp para evitar fetchs repetidos */
    fetchingFuncis: Record<string, string[]>;
  };
}