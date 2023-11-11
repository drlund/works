namespace Procuracoes {
  type FluxoMinuta = import('../__mocks__/FluxosProcuracao').FluxoMinuta;

  type TipoFluxo = {
    idFluxo: string;
    minuta: string;
    fluxo: FluxoMinuta['fluxo'];
  };

  type CustomDataMassificado = {
    [matricula: string]: Partial<{
      nome: string;
      estCivil: string;
      matricula: string;
      rg: string;
      cpf: string;
      dependencia: Partial<{
        municipio: string;
        uf: string;
        endereco: string;
      }>;
    }>;
  };

  type CustomData = {
    massificado?: CustomDataMassificado;
    blocoSubsidiarias?: string;
    cartorio?: Partial<{
      monthToday: string;
      dayToday: string;
      yearToday: string;
      cidadeUF: string;
    }>;
    outorgante?: Partial<{
      nome: string;
      estadoCivil: string;
      matricula: string;
      rg: string;
      cpf: string;
      municipio: string;
      endereco: string;
      uf: string;
    }>;
  };

  type DadosMinutaMassificadoPorMatricula = {
    idMinuta: string;
    template: string;
    diffs: string;
  };

  type DadosMinutaMassificado = {
    numberOfValid: number;
    hasError: never;
  } & Record<infer matricula,
    matricula extends 'numberOfValid' ? number
    : matricula extends 'hasError' ? never
    : DadosMinutaMassificadoPorMatricula
  >;

  type DadosMinuta = {
    idTemplate: string;
    idTemplateDerivado: string;
    idFluxo: string;
    /** id do batch */
    idMinuta: string;
    customData: CustomData;
    massificado: DadosMinutaMassificado;
  };

  type OutorgadoMassificado = {
    outorgados: {
      [matricula: string]: {
        matricula: string,
        error: string | null,
      };
    },
    listaDeMatriculas: string[];
    uuidMatriculas: Record<string, string>;
  };

  type Poderes = {
    outorganteSelecionado: {
      matricula: string,
      nome: string,
      idProcuracao: string | number,
      idProxy: string,
      subsidiariasSelected: number[],
    },
    outorgantes: unknown[], // ver react/src/pages/procuracoes/procuracoes.d.ts
  };

  type MassificadoMinuta = {
    tipoFluxo: TipoFluxo;
    dadosMinuta: DadosMinuta;
    outorgadoMassificado: OutorgadoMassificado;
    poderes: Poderes;
  };

  type DadosProcuracao = {
    dataEmissao: string;
    dataVencimento: string;
    dataManifesto?: string;
    custo?: number;
    /** custos da cadeia, separado para controle na super */
    custoCadeia?: number;
    /** cartorio em que foi emitida a cadeia de procuração */
    cartorioCadeia?: number;
    /** marca que custo é para controle da super */
    superCusto?: 1 | 0;
    /** marca que custo é zero */
    zerarCusto?: 1 | 0;
    prefixoCusto?: number;
    folha?: number;
    livro?: number;
  };
}
