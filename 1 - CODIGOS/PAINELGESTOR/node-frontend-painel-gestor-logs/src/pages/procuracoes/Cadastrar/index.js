import { Row } from 'antd';
import React from 'react';
import { CartorioContext } from '../contexts/CartorioContext';
import ProcuracoesContext, {
  ProcuracoesContextWithDefaultDadosWrapper, useCadastroProcuracao
} from '../contexts/ProcuracoesContext';
import FluxosProcuracao from '../innerComponents/FluxosProcuracao';
import { FLUXOS_CADASTRO, FLUXOS_CADASTRO_CONTINUE } from '../innerComponents/FluxosProcuracao/Fluxos';
import { ListaDeMinutas } from '../innerComponents/ListaDeMinutas';
import { SelecionarTipoFluxo } from '../innerComponents/SelecionarTipoFluxo';
import { fluxosProcessos } from '../innerComponents/SelecionarTipoFluxo/helpers/fluxosProcessos';
import { CadastrarProcuracaoInstrucoes } from './internalComponents/CadastrarProcuracaoInstrucoes';

function Cadastrar({ fluxos = FLUXOS_CADASTRO, fromMinuta = false }) {
  const { dadosProcuracao } = useCadastroProcuracao();

  return (
    <Row gutter={[0, 15]}>
      {
        (!fromMinuta && dadosProcuracao.tipoFluxo === null)
        && <CadastrarProcuracaoInstrucoes />
      }

      {
        (!fromMinuta)
        && <SelecionarTipoFluxo />
      }

      {
        (dadosProcuracao.tipoFluxo !== null)
        && (
          dadosProcuracao.tipoFluxo.fluxo === 'PARTICULAR'
              // particular não precisa de cartório
            ? <FluxosProcuracao fluxos={fluxos} />
            : (
              // pública/subsidiaria possuem cartorio
              // e depois, para a pública, a lisa de cartórios é usada nos custos
              <CartorioContext>
                <FluxosProcuracao fluxos={fluxos} />
              </CartorioContext>
            )
        )
      }

      {
        (!fromMinuta && dadosProcuracao.tipoFluxo === null)
        && <ListaDeMinutas />
      }
    </Row>
  );
}

export default () => (
  <ProcuracoesContext fluxoProcesso={fluxosProcessos.cadastro}>
    <Cadastrar />
  </ProcuracoesContext>
);

export const CadastrarContinue = () => (
  <ProcuracoesContextWithDefaultDadosWrapper fluxoProcesso={fluxosProcessos.cadastro}>
    <Cadastrar fluxos={FLUXOS_CADASTRO_CONTINUE} fromMinuta />
  </ProcuracoesContextWithDefaultDadosWrapper>
);
