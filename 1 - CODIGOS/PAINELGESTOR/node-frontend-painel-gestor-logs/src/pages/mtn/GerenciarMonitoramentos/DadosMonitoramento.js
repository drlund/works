import React from "react";
import { Descriptions } from "antd";

const DadosMonitoramento = (props) => {
  const { dadosMonitoramento } = props;

  return (
    <Descriptions column={4} bordered>
      <Descriptions.Item label="Nome" span={4}>
        {dadosMonitoramento.nome}
      </Descriptions.Item>
      <Descriptions.Item label="Descrição" span={4}>
        {dadosMonitoramento.descricao}
      </Descriptions.Item>
      <Descriptions.Item label="Nome Reduzido" span={4}>
        {dadosMonitoramento.nomeReduzido
          ? dadosMonitoramento.nomeReduzido
          : "Não informado"}
      </Descriptions.Item>
      <Descriptions.Item label="Criado Em" span={4}>
        {dadosMonitoramento.createdAt}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default DadosMonitoramento;
