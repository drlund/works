import { Card, Typography } from 'antd';
import React from 'react';
import './Instrucoes.scss';

const { Paragraph } = Typography;

function Instrucoes() {
  return (
    <Card title={<Typography.Title level={2}>Instruções</Typography.Title>}>
      <div className='paragraphs'>
        <Paragraph>
          Bem-vindo a nova plataforma de gestão das Procurações.
          Aqui você pode consultar as procurações, gerenciar os documentos de seu prefixo e confeccionar minutas de substabelecimento de procuração.
        </Paragraph>
        <Paragraph>
          Sempre que possível priorize o uso das vias de procuração digitais, mais prático e econômico para o Banco.
          Basta o cliente apresentar ao Cartório os dois documentos em cópias simples (o Substabelecimento + Manifesto de Assinaturas com o QR Code)
          ou até mesmo a apresentação do QR Code no próprio celular.
        </Paragraph>
        <Paragraph>
          Através desse QR Code, o Cartório tem acesso à visualização na íntegra da Procuração original e pode realizar a validação do documento pelo
          <a href="https://assinatura.e-notariado.org.br/validate" target='_blank' rel='noreferrer'>
            {` site do e-notariado validate`}
          </a>
          .
        </Paragraph>
        <Paragraph>
          Entretanto, se ainda assim houver exigência cartorária de entrega de cópias autenticadas,
          a confecção poderá ser realizada em Cartórios locais a partir das Certidões físicas que direcionamos aos prefixos.
          Importante manter a via original na dependência.
        </Paragraph>
        <Paragraph>
          Conforme
          <a href="https://www.notariado.org.br/wp-content/uploads/2020/05/DJ156_2020-ASSINADO.pdf" target='_blank' rel='noreferrer'>
            {` artigo 29 do Provimento 100 `}
          </a>
          do Conselho Nacional de Justiça (CNJ):
        </Paragraph>
        <Paragraph style={{ fontStyle: 'italic' }}>
          {
            `"Os atos notariais eletrônicos, cuja autenticidade seja conferida pela internet por meio do e-Notariado,
            constituem instrumentos públicos para todos os efeitos legais e são eficazes para os registros públicos,
            instituições financeiras, juntas comerciais, Detrans e para a produção de efeitos jurídicos perante
            a administração pública e entre particulares."`
          }
        </Paragraph>
        <Paragraph>Selecione abaixo a opção desejada.</Paragraph>
      </div>
    </Card>
  );
}

export default Instrucoes;
