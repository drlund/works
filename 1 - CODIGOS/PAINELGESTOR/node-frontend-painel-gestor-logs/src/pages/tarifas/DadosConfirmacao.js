import React from "react";
// import { Typography } from "antd";
import { Descriptions } from "antd";
// import styled from "styled-components";
// const { Text } = Typography;

// const AnexoLink = styled.div`
//   color: #1890ff;
//   cursor: pointer;
//   transition: all 0.2s;
//   &:hover {
//     font-size: 105%;
//   }
// `;

const DadosConfirmacao = (props) => {
  const { ocorrencia } = props;
  const { pagamento } = ocorrencia;

  const confirmacao =
    pagamento && pagamento.confirmacoes ? pagamento.confirmacoes : null;

  if (!confirmacao) {
    return null;
  }

  return (
    <Descriptions column={4} bordered>
      <Descriptions.Item span={4} label="Data da Confirmacao">
        {confirmacao.createdAt}
      </Descriptions.Item>
      <Descriptions.Item span={4} label="Confirmado por">
        {`${confirmacao.matriculaFunciConfirmacao} - ${confirmacao.nomeFunciConfirmacao}`}
      </Descriptions.Item>
      {confirmacao.observacao && (
        <Descriptions.Item span={4} label="Observações">
          {confirmacao.observacao}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default DadosConfirmacao;
