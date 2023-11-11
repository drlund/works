namespace Procuracoes {
  type ProcuracoesContext = {
    fluxos: Fluxos;
    fluxoProcesso: TypeForFluxoProcesso;
    dadosProcuracao: Partial<DadosProcuracao>;
    setDadosProcuracao: React.Dispatch<React.SetStateAction<Partial<DadosProcuracao>>>;
  };

  type Fluxos = { [key: string]: Fluxo; };

  type Fluxo = {
    minuta: string;
    idFluxo: string;
    fluxo: 'PUBLICA' | 'PARTICULAR' | 'SUBSIDIARIA';
    outorgados?: {
      refOrganizacional?: string[];
      prefixos?: string[];
    };
    visibilidade?: string[];
  };

  type Cartorio = {
    id: number;
    cnpj: string;
    nome: string;
    cep: string;
    endereco: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    createdAt: string;
    updatedAt: string;
    ativo: 1 | 0;
  };

  type DocumentoProcuracao = {
    dataEmissao: import('moment').Moment;
    dataVencimento: import('moment').Moment;
  } & ({
    dataManifesto: import('moment').Moment;
    custo: number;
    /** valor da cadeia para cadastro */
    custoCadeia: number;
    /** cartorio em que foi emitida a cadeia de procuração */
    cartorioCadeia: number;
    /** verifica se custo é marcado para controle da super */
    superCusto: boolean;
    /** para procuracoes particular, possibilidade de sem custo */
    zerarCusto: boolean;
    prefixoCusto: number;
    livro: number;
    folha: number;
  }) & ({
    arquivoProcuracao: {
      file: import('antd/lib/upload').RcFile;
      url: string | ArrayBuffer;
    };
    urlDocumento: null;
  } | {
    arquivoProcuracao: null;
    urlDocumento: string;
  });

  type FunciError = { matricula: string; error: string; nome?: Funci['nome']; };

  type FetchedFunci = Funci | FunciError;

  type ProcuracaoAgregada = {
    procuracaoId: number;
    procuracaoAtiva: number;
    emissao: string;
    vencimento: string;
    manifesto: string;
    folha: string;
    livro: string;
    doc: string;
    cartorio: string;
    cartorioId: number;
  };

  /**
   * tipo usado em outros lugares para referenciar uma subsidiaria (poder)
   */
  type Subsidiaria = {
    id: number;
    nome: string;
    nome_completo: string;
    cnpj: string;
    subAtivo: number;
    procuracaoId?: number;
    procuracaoAtiva?: number;
    emissao?: string;
    vencimento?: string;
    manifesto?: string;
    folha?: string;
    livro?: string;
    doc?: string;
    cartorio?: string;
    cartorioId?: number;
  };

  /**
   * tipo ao cadastrar a subsidiaria
   */
  type SubsidiariaCadastro = {
    id: number;
    cnpj: string;
    nomeReduzido: string;
    nome: string;
    cep: string;
    endereco: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    createdAt: string;
    updatedAt: string;
    ativo: 1 | 0;
  };

  type OutorgadoProcuracao = {
    matricula: string;
    nome: string;
    cargo: string;
    prefixo: string;
    cpf: string;
    rg: string;
    estadoCivil: string;
    municipio: string;
    uf: string;
    endereco: string;
  };

  type Procuracao = {
    procuracaoAgregada: ProcuracaoAgregada;
    outorgado: OutorgadoProcuracao;
    subsidiarias: Subsidiaria[];
  };

  type Outorgante = ({
    idProcuracao?: null;
    idProxy: string;
  } | {
    idProcuracao: number;
    idProxy?: null;
  }) & {
    matricula: string;
    nome: string;
    cargoNome: string;
    prefixo: string;
    ativo: 1 | 0;
    prefixo_lotacao: string;
    cpf: string;
    dataNasc: string;
    estadoCivil: string;
    rg: string;
    municipio: string;
    uf: string;
    endereco: string;
    procuracao: Procuracao[];
  };

  type OutorganteSelecionado = ({
    idProcuracao?: null;
    idProxy: string;
  } | {
    idProcuracao: number;
    idProxy?: null;
  }) & {
    matricula: string;
    nome: string;
    subsidiariasSelected: number[];
  };

  type Poderes = {
    outorgantes: Outorgante[];
    outorganteSelecionado: OutorganteSelecionado;
  };

  type DadosMinuta = {
    idFluxo: string;
    idTemplate: string;
    idTemplateDerivado: string;
    idMinuta: string;
    templateBase: string;
    customData: {
      cartorio: Record<string, string>;
      outorgante: Record<string, string>;
      blocoSubsidiarias: string;
      outorgado: Record<string, string | Record<string, string>>;
      massificado: {
        [matricula: string]: Record<string, string | Record<string, string>>;
      };
    };
  } & ({
    template: string;
    diffs: string;
    massificado?: never;
  } | {
    template?: never;
    diffs?: never;
    massificado: {
      [matricula: string]: {
        isValid: boolean;
        idMinuta: string;
        template: string;
        diffs: string;
      };
    };
  });

  type MinutaCadastrada = {
    idMinuta: string;
    idFluxo: string;
    matriculaOutorgado: string;
    outorgante_idProcuracao?: string;
    outorgante_idProxy?: string;
    outorgante_subsidiariasSelected: string;
    idTemplateBase: string;
    idTemplateDerivado?: string;
    dadosMinuta_diffs: string;
    dadosMinuta_customData: string;
    matriculaRegistro: string;
    createdAt: string;
    updatedAt: string;
    ativo: 1 | 0;
  };

  type DadosProcuracao = {
    tipoFluxo: Fluxo | null;
    cartorio: Cartorio;
    dadosProcuracao: DocumentoProcuracao;
    dadosMinuta: DeepPartial<DadosMinuta>;
    minutaCadastrada: MinutaCadastrada;
    poderes: Poderes;
    subsidiaria: SubsidiariaCadastro;
  } & ({
    outorgado: Funci;
    outorgadoMassificado: never;
  } | {
    outorgado: never;
    outorgadoMassificado: import('./innerComponents/FluxosProcuracao/Etapas/EtapaOutorgadoMassificado').ListasEtapaOutorgadoMassificado;
  });

  type FluxosProcessos = typeof import('./innerComponents/SelecionarTipoFluxo/helpers/fluxosProcessos').fluxosProcessos;
  type TypeForFluxoProcesso = FluxosProcessos[keyof FluxosProcessos];
}
