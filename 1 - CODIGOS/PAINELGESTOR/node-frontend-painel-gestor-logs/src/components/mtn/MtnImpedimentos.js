import React from "react";
import { Typography, List } from "antd";

const { Text } = Typography;

export default function MtnImpedimentos(props) {
  let impedimentos = props.impedimentos;
  const dataImped = [
    <span>
      <Text strong>Comissionamento: </Text> {impedimentos.comissionamento}
    </span>,
    <span>
      <Text strong>ODI: </Text> {impedimentos.odi}
    </span>,
    <span>
      <Text strong>PAS: </Text> {impedimentos.pas}
    </span>,
    <span>
      <Text strong>Relac. Institucional: </Text> {impedimentos.institRelac}
    </span>,
    <span>
      <Text strong>Bolsa Estudos: </Text> {impedimentos.bolsaEstudos}
    </span>,
    <span>
      <Text strong>Reincidente nos últimos 12 meses? </Text> {impedimentos.reincidente ? "Sim" : "Não"}
    </span>
  ];

  return (
    <div>
      <List
        size="small"
        bordered
        dataSource={dataImped}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </div>
  );
}
