import React from "react";
import { Typography, Card } from "antd";

const { Paragraph, Text } = Typography;

const Instrucoes = (props) => {
  return (
    <Card style={{ paddingTop: "1rem" }}>
      <Paragraph>
        Nessa tela é possível aos membros do <Text strong>Comitê MTN</Text>{" "}
        consultar/conduzir as votações referentes aos parâmetros dos{" "}
        <Text strong>Monitoramentos</Text>. Aque estão apresentados os
        monitoramentos para os quais foi incluída alteração e a mesma
        encontra-se pendente de votação pelo comitê MTN ou está pendente de
        alteração dos parâmetros.{" "}
      </Paragraph>
    </Card>
  );
};

export default Instrucoes;
