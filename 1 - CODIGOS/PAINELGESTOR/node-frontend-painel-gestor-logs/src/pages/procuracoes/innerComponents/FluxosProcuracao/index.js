import {
  Col, message
} from 'antd';
import React, { useCallback, useState } from 'react';

import CardSecao from 'components/CardSecao';
import { useCadastroProcuracao } from '../../contexts/ProcuracoesContext';
import { StepsDisplay } from './StepsDisplay';

/**
 * @param {{fluxos: Procuracoes.AllFluxos}} props
 */
const FluxosProcuracao = ({ fluxos }) => {
  const { dadosProcuracao, setDadosProcuracao } = useCadastroProcuracao();
  const [currentStep, setCurrentStep] = useState(0);

  const { tipoFluxo } = dadosProcuracao;

  const fluxoAtual = /** @type {Procuracoes.AllFluxosBaseFluxo<any,any>} */ (fluxos[tipoFluxo.fluxo][currentStep]);

  const dadosEtapa = (() => {
    if (fluxoAtual.useAllData || !fluxoAtual.nomeCampo) {
      return dadosProcuracao;
    }
    return dadosProcuracao[
    /** @type {keyof Procuracoes.DadosProcuracao} */
      (fluxoAtual.nomeCampo)
    ];
  })();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === fluxos[tipoFluxo.fluxo].length;

  const nextStep = () => {
    if (isLastStep) {
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep === 0) {
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  /**
   * @param {string} stepName
   */
  const goToStep = (stepName) => {
    const stepToGo = fluxos[tipoFluxo.fluxo].findIndex(
      ({ nomeCampo }) => nomeCampo === stepName
    );
    setCurrentStep(stepToGo);
  };

  const adicionarStep = useCallback(
    /**
     * @type {(dadosFluxo: unknown) => void}
     */
    (dadosFluxo) => {
    fluxoAtual
      .validar(dadosFluxo)
      .then((dadosFluxoValidado) => {
        const newDados = (!fluxoAtual.nomeCampo)
          ? dadosFluxoValidado
          : ({ [fluxoAtual.nomeCampo]: dadosFluxoValidado });

        setDadosProcuracao({
          ...dadosProcuracao,
          ...newDados,
        });
        nextStep();
      })
      .catch((error) => {
        message.error(error);
      });
  }, [dadosProcuracao, fluxoAtual]);

  const CurrentStep = useCallback(fluxoAtual.componente, [fluxoAtual]);

  return (
    <>
      <Col span={24}>
        <StepsDisplay
          currentStep={currentStep}
          fluxoSteps={fluxos[tipoFluxo.fluxo]}
        />
      </Col>
      <Col span={24}>
        <CardSecao title={fluxoAtual.titulo}>
          <CurrentStep
            tipoFluxo={tipoFluxo}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            dadosEtapa={dadosEtapa}
            adicionarStep={adicionarStep}
            subtrairStep={prevStep}
            goToStep={goToStep}
          />
        </CardSecao>
      </Col>
    </>
  );
};

export default FluxosProcuracao;
