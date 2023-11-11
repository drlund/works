import React from 'react';
import { EtapaDadosProcuracao } from '../DadosProcuracao/Etapa';
import { tiposEtapa } from '../DadosProcuracao/tiposEtapa';

/**
 * @param {Procuracoes.CurrentStepParameters<Procuracoes.DocumentoProcuracao>} props
 */
export const EtapaDocumentoParticular = ({ subtrairStep, adicionarStep, dadosEtapa }) => (
  <EtapaDadosProcuracao
    subtrairStep={subtrairStep}
    adicionarStep={adicionarStep}
    dadosEtapa={dadosEtapa}
    tipoEtapa={tiposEtapa.particular}
  />
);
