import React from 'react';
import { Typography, Card } from 'antd';

const { Paragraph } = Typography;

const InstrucoesHome = () => {
  return (
    <Card title="Olá, seja bem-vindo(a)">
      <Paragraph>
        Se você chegou aqui, é porque teve um convite muito especial para
        participar de uma das campanhas vigentes.
      </Paragraph>
      <Paragraph>
        Abaixo você terá acesso à campanha disponível e, para acessar, basta
        clicar no botão respectivo para ser direcionado aos passos necessários
        para registrar sua participação.
      </Paragraph>
      <Paragraph>
        Você também poderá consultar suas participações em campanhas passadas.
      </Paragraph>
      <Paragraph>
        Sua colaboração é muito importante! Fique atento e registre todas as
        avaliações antes de finalizar, pois não será possível sair e retornar de
        onde parou.
      </Paragraph>
    </Card>
  );
};

export default InstrucoesHome;
