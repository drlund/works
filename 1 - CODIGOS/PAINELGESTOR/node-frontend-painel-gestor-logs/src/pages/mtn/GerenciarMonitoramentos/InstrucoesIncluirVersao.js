import React from "react";
import { Typography, Card } from "antd";

const { Paragraph, Text } = Typography;

const InstrucoesIncluirVersao = (props) => {
  return (
    <Card>
      <Paragraph>
        Preenchendo o formulário abaixo é incluir a votação para alterar um
        monitoramento. O seguintes campos estão disponíveis:
      </Paragraph>
      <Paragraph>
        <ul>
          <li>
            <Text strong>Tipo de Votação:</Text> indica qual ação irá para
            votação.
          </li>
          <li>
            <Text strong>Motivação:</Text> deverá ser preenchido com os fatos
            que estão motivando a votação sendo incluída.{" "}
          </li>
          <li>
            <Text strong>Documento:</Text>deverá ser incluído documento PDF
            contendo descrição detalhada do dados que irão embasar a votação.
          </li>
        </ul>
      </Paragraph>
    </Card>
  );
};

export default InstrucoesIncluirVersao;
