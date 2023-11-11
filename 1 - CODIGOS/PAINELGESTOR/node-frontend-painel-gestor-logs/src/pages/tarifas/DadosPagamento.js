import React from "react";
// import {Typography } from "antd";
import { Descriptions } from "antd";
import styled from "styled-components";
// const { Text } = Typography;

const AnexoLink = styled.div`
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    font-size: 105%;
  }
`;

const DadosPagamento = (props) => {
  const { ocorrencia } = props;
  const { pagamento } = ocorrencia;

  return (
    <Descriptions column={4} bordered>
      <Descriptions.Item span={4} label="Data do pagamento">
        {pagamento.dataPagamento}
      </Descriptions.Item>
      {pagamento.observacoes && (
        <Descriptions.Item span={4} label="Observações">
          {pagamento.observacoes}
        </Descriptions.Item>
      )}
      {pagamento.anexos && (
        <Descriptions.Item span={4} label="Comprovantes de pagamento">
          {pagamento.anexos.map((anexo) => {
            return (
              <AnexoLink>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    process.env.REACT_APP_ENDPOINT_API_URL +
                    "/" +
                    anexo.caminhoArquivo +
                    anexo.nomeArquivo
                  }
                >
                  {anexo.nomeOriginal}
                </a>
              </AnexoLink>
            );
          })}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default DadosPagamento;
