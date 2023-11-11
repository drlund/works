import React from 'react';
import { Space, Typography, message } from 'antd';
import styled from 'styled-components';
import { downloadAnexoService } from 'pages/flexCriterios/apiCalls/anexosAPICall';
import { DownloadFileUtil } from 'utils/Commons';

const AnexoLink = styled.div`
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    font-size: 105%;
  }
`;

export default function Resumo({ pedidoFlex }) {
  console.log('PEDIDO FLEX', pedidoFlex);

  const baixarAnexo = (anexo) => {
    downloadAnexoService(anexo.url)
      .then((response) => {
        DownloadFileUtil(anexo.nome, response);
        message.success('Documento baixado com sucesso');
      })
      .catch(() => message.error('Erro ao realizar o download.'));
  };

  return (
    <Space direction="vertical">
      <Typography.Text>
        <Typography.Text strong>Identificador</Typography.Text>:{' '}
        {pedidoFlex?.id}
      </Typography.Text>
      <Typography.Text>
        <Typography.Text strong>Prefixo Origem</Typography.Text>:{' '}
        {pedidoFlex?.funcionarioEnvolvido.prefixoOrigem.prefixo}
      </Typography.Text>
      <Typography.Text>
        <Typography.Text strong>Prefixo Destino</Typography.Text>:{' '}
        {pedidoFlex?.funcionarioEnvolvido.prefixoDestino.prefixo}
      </Typography.Text>
      <Typography.Text>
        <Typography.Text strong>Cod. Oportunidade</Typography.Text>:{' '}
        {pedidoFlex?.funcionarioEnvolvido.oportunidade.toUpperCase()}
      </Typography.Text>

      <Typography.Text>
        <Typography.Text strong>Solicitante</Typography.Text>:{' '}
        {`${pedidoFlex?.matriculaSolicitante} - ${pedidoFlex?.nomeSolicitante}`}
      </Typography.Text>
      <Typography.Text>
        <Typography.Text strong>
          Justificativa do prefixo de destino
        </Typography.Text>
        : {pedidoFlex?.manifestacoes[0]?.texto}
      </Typography.Text>

      <Space direction="vertical">
        <Typography.Text strong>Anexos</Typography.Text>
        {pedidoFlex?.anexos.map((elem) => (
          <>
            <AnexoLink
              onClick={() => {
                console.log('Dados Anexo:', elem);
                baixarAnexo(elem);
              }}
            >
              {elem?.nome}
            </AnexoLink>
          </>
        ))}
      </Space>
    </Space>
  );
}
