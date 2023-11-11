import {
  Button, Col, Row, Space
} from 'antd';
import React, { useCallback, useState } from 'react';

import { AcordeaoProcuracoes } from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes';
import { ItemAcordeao } from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/ItemAcordeaoCadastro';
import { PesquisaComponent } from 'pages/procuracoes/innerComponents/PesquisaComponent';
import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';
import { fluxosProcessos } from 'pages/procuracoes/innerComponents/SelecionarTipoFluxo/helpers/fluxosProcessos';

/**
 * @param {Procuracoes.CurrentStepParameters<Procuracoes.Poderes>} props
 */
const EtapaOutorgante = ({
  dadosEtapa = /** @type {Procuracoes.Poderes} */({}),
  subtrairStep,
  adicionarStep,
}) => {
  const { fluxoProcesso } = useCadastroProcuracao();
  const [outorgantes, setOutorgantes] = useState(dadosEtapa?.outorgantes || []);
  const [outorganteSelecionado, setOutorganteSelecionado] = useState(
    dadosEtapa?.outorganteSelecionado || null
  );

  const handlePesquisa = useCallback(
    /** @param {Procuracoes.Poderes['outorgantes']} listaOutorgantes */
    (listaOutorgantes) => {
      setOutorgantes(listaOutorgantes);
      setOutorganteSelecionado(null);
      dadosEtapa.outorgantes = listaOutorgantes;
      dadosEtapa.outorganteSelecionado = null;
    },
    [dadosEtapa]
  );

  const selectOutorgante = useCallback(
    /** @param {Procuracoes.Poderes['outorganteSelecionado']} outorgante */
    (outorgante) => {
      setOutorganteSelecionado(outorgante);
      dadosEtapa.outorganteSelecionado = outorgante;
    },
    [dadosEtapa]
  );

  const ItemAcordeaoCadastro = useCallback(
    ItemAcordeao(selectOutorgante, outorganteSelecionado),
    [outorganteSelecionado]
  );

  const hasPoderesSelected = outorganteSelecionado !== null;

  return (
    <Row
      gutter={[0, 20]}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 0,
      }}
    >
      <PesquisaComponent
        handlePesquisa={handlePesquisa}
        showAll={
          fluxoProcesso === fluxosProcessos.cadastro
        }
      />
      <div style={{ width: '100%' }}>
        <AcordeaoProcuracoes
          outorgados={outorgantes}
          ItemAcordeao={ItemAcordeaoCadastro}
        />
      </div>

      <Col span={24}>
        <Space>
          {subtrairStep && (
            <Button type="default" onClick={() => subtrairStep()}>
              Anterior
            </Button>
          )}
          {hasPoderesSelected && adicionarStep && (
            <Button
              type="default"
              onClick={() => {
                adicionarStep({
                  outorgantes,
                  outorganteSelecionado,
                });
              }}
            >
              Próximo
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default EtapaOutorgante;
