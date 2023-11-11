import { Row } from 'antd';

import { PermissionGuard } from 'components/PermissionGuard';
import ProcuracoesContext, {
  ProcuracoesContextWithDefaultDadosWrapper,
  useCadastroProcuracao
} from 'pages/procuracoes/contexts/ProcuracoesContext';
import { useProcuracoesMassificado } from 'pages/procuracoes/hooks/useProcuracoesMassificado';
import FluxosProcuracao from 'pages/procuracoes/innerComponents/FluxosProcuracao';
import {
  FLUXOS_MASSIFICADO_MINUTA,
  FLUXOS_MASSIFICADO_MINUTA_CONTINUE,
} from 'pages/procuracoes/innerComponents/FluxosProcuracao/Fluxos';
import { SelecionarTipoFluxo } from 'pages/procuracoes/innerComponents/SelecionarTipoFluxo';
import { fluxosProcessos } from 'pages/procuracoes/innerComponents/SelecionarTipoFluxo/helpers/fluxosProcessos';

/**
 * @param {{
 *  fluxos?: typeof FLUXOS_MASSIFICADO_MINUTA,
 *  fromMassificado?: false,
 * }|{
 *  fluxos: typeof FLUXOS_MASSIFICADO_MINUTA_CONTINUE,
 *  fromMassificado: true,
 * }} props
 */
function Minuta({ fluxos = FLUXOS_MASSIFICADO_MINUTA, fromMassificado = false }) {
  const { dadosProcuracao } = useCadastroProcuracao();
  const massificadoPermission = useProcuracoesMassificado();

  return (
    <PermissionGuard
      guard={massificadoPermission}
    >
      <Row gutter={[0, 15]}>
        {
          (!fromMassificado)
          && <SelecionarTipoFluxo />
        }

        {
          (dadosProcuracao.tipoFluxo !== null)
          && <FluxosProcuracao fluxos={fluxos} />
        }
      </Row>
    </PermissionGuard>
  );
}

export default () => (
  <ProcuracoesContext fluxoProcesso={fluxosProcessos.massificadoMinuta}>
    <Minuta />
  </ProcuracoesContext>
);

export const MassificadoContinue = () => (
  <ProcuracoesContextWithDefaultDadosWrapper fluxoProcesso={fluxosProcessos.massificadoMinuta}>
    <Minuta fluxos={FLUXOS_MASSIFICADO_MINUTA_CONTINUE} fromMassificado />
  </ProcuracoesContextWithDefaultDadosWrapper>
);
