import {
  Button, Col, Row, Space
} from 'antd';
import { createPatch } from 'diff';
import React, { useState } from 'react';

import { MinutaTemplateShowData } from 'pages/procuracoes/innerComponents/MinutaTemplate';
import { changeDadosProcuracao } from 'pages/procuracoes/innerComponents/MinutaTemplate/ReadOnly/changeDadosProcuracao';
import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';

/**
 * @param {Procuracoes.CurrentStepParameters<
 *  Procuracoes.DadosMinuta,
 *  { isValid: boolean, dadosEtapa: Procuracoes.DadosMinuta }>
 * } props
 */
export const EtapaMinuta = ({ dadosEtapa, subtrairStep, adicionarStep }) => {
  const [{ isValid, template }, setDados] = useState(/** @type {{ isValid: boolean, template: string }} */({}));
  const { dadosProcuracao, setDadosProcuracao } = useCadastroProcuracao();

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
      <Col span={24} style={{ width: '100%' }}>
        <MinutaTemplateShowData
          templateBase={dadosEtapa.templateBase}
          dadosProcuracao={dadosProcuracao}
          editable
          changeDadosProcuracao={changeDadosProcuracao(setDadosProcuracao)}
          callback={setDados}
        />
      </Col>

      <Col span={24}>
        <Space>
          {subtrairStep && (
            <Button type="default" onClick={() => subtrairStep()}>
              Anterior
            </Button>
          )}
          {adicionarStep && (
            <Button
              type="default"
              disabled={!isValid}
              onClick={() => {
                adicionarStep({
                  isValid,
                  dadosEtapa: {
                    ...dadosEtapa,
                    template,
                    diffs: createPatch(
                      'diff',
                      dadosEtapa.templateBase,
                      template
                    )
                  }
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
