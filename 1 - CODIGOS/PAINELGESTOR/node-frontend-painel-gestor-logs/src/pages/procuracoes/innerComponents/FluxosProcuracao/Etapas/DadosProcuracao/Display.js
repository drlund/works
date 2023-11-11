import {
  Button, Descriptions, Space, Typography
} from 'antd';
import React from 'react';

const { Text } = Typography;
const DDMMYYYY = 'DD/MM/YYYY';

/**
 * @param {{
 *  dadosProcuracao: Procuracoes.DocumentoProcuracao
 * }} props
 */
const DisplayDadosProcuracao = ({ dadosProcuracao }) => {
  if (!dadosProcuracao) {
    return null;
  }

  const procuracaoPublica =
    (dadosProcuracao.dataManifesto !== undefined && dadosProcuracao.dataManifesto !== null)
    && (dadosProcuracao.livro !== undefined && dadosProcuracao.livro !== null)
    && (dadosProcuracao.folha !== undefined && dadosProcuracao.folha !== null);

  return (

    <Descriptions layout="vertical">
      <Descriptions.Item label={<Text strong>Data Emissão</Text>}>
        {dadosProcuracao.dataEmissao.format(DDMMYYYY)}
      </Descriptions.Item>
      <Descriptions.Item label={<Text strong>Data de Vencimento</Text>}>
        {dadosProcuracao.dataVencimento.format(DDMMYYYY)}
      </Descriptions.Item>
      {
        procuracaoPublica && (
          <>
            <Descriptions.Item label={<Text strong>Data Manifesto de Assinaturas</Text>}>
              {dadosProcuracao.dataManifesto.format(DDMMYYYY)}
            </Descriptions.Item>
            <Descriptions.Item label={<Text strong>Livro</Text>}>
              {dadosProcuracao.livro}
            </Descriptions.Item>
            <Descriptions.Item label={<Text strong>Folha</Text>}>
              {dadosProcuracao.folha}
            </Descriptions.Item>
          </>
        )
      }
      {dadosProcuracao.arquivoProcuracao
        // @ts-ignore
        && dadosProcuracao.arquivoProcuracao.file
        && (
          <Descriptions.Item label={<Text strong>Arquivo</Text>}>
            <div>
              <Space>
                <Button type="link">
                {
                  // @ts-ignore
                  dadosProcuracao.arquivoProcuracao.file.name
                }
                </Button>
              </Space>
            </div>
          </Descriptions.Item>
        )}
      {dadosProcuracao.urlDocumento && (
        <Descriptions.Item label={<Text strong>Arquivo</Text>}>
          <div>
            <Space>
              <Button type="link">{dadosProcuracao.urlDocumento}</Button>
            </Space>
          </div>
        </Descriptions.Item>
      )}
    </Descriptions>

  );
};

export default DisplayDadosProcuracao;
