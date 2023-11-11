import { Row } from 'antd';
import React from 'react';
import ProcuracoesContext, {
  ProcuracoesContextWithDefaultDadosWrapper, useCadastroProcuracao
} from '../contexts/ProcuracoesContext';
import FluxosProcuracao from '../innerComponents/FluxosProcuracao';
import { FLUXOS_MINUTA, FLUXOS_MINUTA_CONTINUE } from '../innerComponents/FluxosProcuracao/Fluxos';
import { SelecionarTipoFluxo } from '../innerComponents/SelecionarTipoFluxo';
import { fluxosProcessos } from '../innerComponents/SelecionarTipoFluxo/helpers/fluxosProcessos';
import { InstrucoesMinutas } from './internalComponents/InstrucoesMinutas';
import { ListaDeMinutas } from '../innerComponents/ListaDeMinutas';

/**
 * @param {{
 *  fluxos?: typeof FLUXOS_MINUTA,
 *  fromMinuta?: false
 * }|{
 *  fluxos: typeof FLUXOS_MINUTA_CONTINUE
 *  fromMinuta: true
 * }} props
 */
function Minutas({ fluxos = FLUXOS_MINUTA, fromMinuta = false }) {
  const { dadosProcuracao } = useCadastroProcuracao();

  return (
    <Row gutter={[0, 15]}>
      {
        (!fromMinuta && dadosProcuracao.tipoFluxo === null)
        && <InstrucoesMinutas />
      }

      {
        (!fromMinuta)
        && <SelecionarTipoFluxo />
      }

      {
        (!fromMinuta && dadosProcuracao.tipoFluxo === null)
        && <ListaDeMinutas />
      }

      {
        (dadosProcuracao.tipoFluxo !== null)
        && <FluxosProcuracao fluxos={fluxos} />
      }
    </Row>
  );
}

export default () => (
  <ProcuracoesContext
    fluxoProcesso={fluxosProcessos.minuta}
  >
    <Minutas />
  </ProcuracoesContext>
);

export const MinutasContinue = () => (
  <ProcuracoesContextWithDefaultDadosWrapper
    fluxoProcesso={fluxosProcessos.minuta}
  >
    <Minutas fluxos={FLUXOS_MINUTA_CONTINUE} fromMinuta />
  </ProcuracoesContextWithDefaultDadosWrapper>
);
