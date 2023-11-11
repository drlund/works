import React from 'react';
import { Col, Row } from 'antd';
import { BoldLabelDisplay } from 'components/BoldLabelDisplay';
import { datoToBRStringOnlyIfSeparator } from 'utils/dateToBRTimezoneString';

/**
 * @param {Object} props
 * @param {import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion} props.procuracao
 */
export function DadosProcuracaoHistorico({ procuracao }) {
  const isPublica = Boolean(procuracao.cartorio);
  const hasSubsidiarias = Boolean(procuracao.subsidiarias);
  const hasOutorgante = Boolean(procuracao.outorgante);

  return (
    <>
      <strong style={{ fontSize: '1.1em', marginBottom: '1em', display: 'inline-block' }}>
        Dados da Procuração
      </strong>
      <Row gutter={16} style={{ marginBottom: '1em' }}>
        <Col className="gutter-row">
          <BoldLabelDisplay
            label="Tipo"
            value={isPublica ? 'PÚBLICA' : 'PARTICULAR'}
          />
        </Col>
      </Row>
      {isPublica && (
        <Row gutter={16} style={{ marginBottom: '1em' }}>
          <Col className="gutter-row" span={14}>
            <BoldLabelDisplay
              label="Cartório"
              value={procuracao.cartorio}
            />
          </Col>
          <Col className="gutter-row" span={4}>
            <BoldLabelDisplay
              label="Livro"
              value={procuracao.livro}
            />
          </Col>
          <Col className="gutter-row" span={6}>
            <BoldLabelDisplay
              label="Folha"
              value={procuracao.folha}
            />
          </Col>
        </Row>
      )}
      <Row gutter={16} style={{ marginBottom: '1em' }}>
        <Col className="gutter-row" span={hasSubsidiarias ? 8 : 20}>
          <BoldLabelDisplay
            label="Vigência"
            value={`${datoToBRStringOnlyIfSeparator(procuracao.emissao)} a ${datoToBRStringOnlyIfSeparator(procuracao.vencimento)}`}
          />
        </Col>
        {hasSubsidiarias && (
        <Col className="gutter-row" span={12}>
          <BoldLabelDisplay
            label="Subsidiárias"
            value={`${new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(procuracao.subsidiarias)}`}
          />
        </Col>
        )}
      </Row>
      {hasOutorgante && (
        <Row gutter={16} style={{ marginBottom: '1em' }}>
          <Col className="gutter-row">
            <BoldLabelDisplay
              label="Outorgante"
              value={`${procuracao.outorgante.matricula} - ${procuracao.outorgante.nome} (${procuracao.outorgante.cargo})`}
            />
          </Col>
        </Row>
      )}
    </>
  );
}
