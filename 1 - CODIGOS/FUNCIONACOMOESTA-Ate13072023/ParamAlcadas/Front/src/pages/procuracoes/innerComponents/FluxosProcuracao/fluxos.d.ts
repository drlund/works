namespace Procuracoes {
  type CurrentStepParameters<dadosEtapa = unknown, adicionarStepParams = dadosEtapa> = {
    tipoFluxo?: Procuracoes.Fluxo;
    isFirstStep?: boolean;
    isLastStep?: boolean;
    dadosEtapa: dadosEtapa;
    adicionarStep: (dados: adicionarStepParams) => void;
    subtrairStep: () => void;
    goToStep?: (stepName: string) => void;
  };

  type AllFluxosBaseFluxo<TValidar = unknown, TRetornoValidacao = TValidar> = {
    titulo: string;
    /** se existe, salva/usa dadosProcuracao[nomeCampo] */
    nomeCampo?: string;
    /** serve para usar como dados da etapa todo os dadosProcuracao */
    useAllData?: true;
    componente: (props: CurrentStepParameters<any>) => JSX.Element;
    validar: (dados: TValidar) => Promise<TRetornoValidacao>;
  };

  type AllFluxos = Record<string, AllFluxosBaseFluxo<any, any>[]>;
}