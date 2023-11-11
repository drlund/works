import {
  Button,
  Col,
  Row,
} from 'antd';

import CardSecao from 'components/CardSecao';
import { MinutaTemplateShowTemplate } from 'pages/procuracoes/innerComponents/MinutaTemplate';

import { useCadastroProcuracao } from '../../contexts/ProcuracoesContext';
import { CampoInformacao } from '../CampoInformacao';
import { fluxosProcessos } from './helpers/fluxosProcessos';
import { DisplayFluxoEscolhido } from './innerComponents/DisplayFluxoEscolhido';
import { useSelectFluxo } from './innerComponents/SelectFluxo';

export const SelecionarTipoFluxo = () => {
  const { dadosProcuracao, fluxoProcesso, setDadosProcuracao } = useCadastroProcuracao();
  const { fluxoSelecionado, dadosMinuta, resetMinuta, SelectFluxo } = useSelectFluxo();

  const escolherFluxo = () => {
    if (isMinuta) {
      setDadosProcuracao({
        ...dadosProcuracao,
        tipoFluxo: fluxoSelecionado,
        dadosMinuta,
      });
    } else {
      setDadosProcuracao({
        ...dadosProcuracao,
        tipoFluxo: fluxoSelecionado,
      });
    }
  };

  const recomecar = () => {
    setDadosProcuracao({ tipoFluxo: null });
    resetMinuta();
  };

  const handleContinuar = () => {
    escolherFluxo();
  };

  const fluxoEscolhido = dadosProcuracao.tipoFluxo !== null;
  const selecaoFeita = fluxoSelecionado !== null;
  const escolhaInicial = selecaoFeita && !fluxoEscolhido;
  const isMinuta = [fluxosProcessos.minuta, fluxosProcessos.massificadoMinuta].includes(fluxoProcesso);

  return (
    <Col span={24}>
      <CardSecao title="Selecionar dados básicos">
        <Row>
          <Col span={24}>
            <Row
              gutter={[20, 10]}
              style={escolhaInicial ? {
                display: 'flex',
                flexDirection: 'column'
              } : {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
              }}>
              <CampoInformacao
                title={
                  fluxoEscolhido
                    ? 'Tipo de fluxo'
                    : 'Selecione o fluxo a ser utilizado'
                }
                extraButton={fluxoEscolhido && (
                  <Button
                    disabled={!selecaoFeita}
                    // @ts-ignore
                    type="danger"
                    onClick={recomecar}
                  >
                    Recomeçar
                  </Button>
                )}
              >
                {fluxoEscolhido
                  ? (
                    <DisplayFluxoEscolhido
                      fluxoUtilizado={dadosProcuracao.tipoFluxo.minuta} />
                  )
                  : (
                    <SelectFluxo />
                  )}
              </CampoInformacao>
              {
                (
                  isMinuta
                  && escolhaInicial
                  && dadosMinuta.templateBase
                ) && (
                  <MinutaTemplateShowTemplate
                    templateBase={dadosMinuta.templateBase}
                  />
                )
              }

              <div style={{ display: 'flex', justifyContent: 'end' }}>
                {!fluxoEscolhido
                  && (
                    <Button
                      disabled={!selecaoFeita}
                      type="primary"
                      onClick={handleContinuar}
                      style={{ zIndex: 100 }}
                    >
                      Continuar
                    </Button>
                  )}
              </div>
            </Row>
          </Col>
        </Row>
      </CardSecao>
    </Col>
  );
};
