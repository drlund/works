import React from 'react';
import { List, Space, Typography, message } from 'antd';
import styled from 'styled-components';
import { downloadAnexoService } from 'pages/flexCriterios/apiCalls/anexosAPICall';
import {
  DownloadFileUtil,
  DownloadPDFFromlink,
  ExtractErrorMessage,
} from 'utils/Commons';
import { DownloadOutlined } from '@ant-design/icons';

const AnexoLink = styled.div`
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    font-size: 105%;
  }
`;

export default function Resumo({ pedidoFlex }) {
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
        <Typography.Text strong>Solicitante</Typography.Text>:{' '}
        {`${pedidoFlex?.matriculaSolicitante} - ${pedidoFlex?.nomeSolicitante}`}
      </Typography.Text>
      <Typography.Text>
        <Typography.Text strong>
          Justificativa do prefixo de destino
        </Typography.Text>
        : {pedidoFlex?.manifestacoes[0]?.texto}
      </Typography.Text>

      <Typography.Text>
        <Typography.Text strong>Anexos</Typography.Text>
        {pedidoFlex?.anexos.map((elem) => (
          <>
            {/*  <Button
              type="link"
              shape="round"
              icon={<DownloadOutlined />}
              size="large"
              href={fileLink}
              download={elem.nome}
              style={{ background: '#1890ff', color: 'white' }}
            >
              Download da Lista para Cartório
            </Button> */}

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
      </Typography.Text>
    </Space>
  );
}
