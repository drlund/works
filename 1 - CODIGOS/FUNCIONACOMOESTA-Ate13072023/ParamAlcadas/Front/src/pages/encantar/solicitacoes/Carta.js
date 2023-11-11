import React from "react";
import { Card, Row, Col, Typography } from "antd";
import style from "./Carta.module.scss";
import ButtonPrintPdf from "components/buttonprintpdf";
import CartaPDF from "./CartaPDF";
import RichEditorCarta from "./RichEditorCarta";
const { Title, Paragraph } = Typography;

function remove_tags(html) {
  html = html.replace(/<br>/g, "$br$");
  html = html.replace(/(?:\r\n|\r|\n)/g, "$br$");
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  html = tmp.textContent || tmp.innerText;
  html = html.replace(/\$br\$/g, "<br>");
  return html;
}

const Carta = (props) => {
  return (
    <Row>
      <Col span={8} offset={1} className={style.imgWrapper}>
        <img
          alt="Mulher com uma carta"
          src={`${process.env.PUBLIC_URL}/assets/images/imgCarta.jpg`}
        />
        <Card style={{ marginTop: 20 }}>
          <Title level={3}> Quer enviar uma carta?</Title>
          <Paragraph className={style.paragraph}>
            Um ativo sem mensagem, é apenas um brinde. Mensagem sem brinde, pode
            ser uma experiência. Brinde com mensagem é experiência
          </Paragraph>
          <Paragraph className={style.paragraph}>
            Assim como o ativo foca na história e no que é valioso, a carta deve
            ser assim também. O ativo que você selecionou já vem acompanhado de
            uma sugestão de experiência, que é uma nova forma de dar significado
            ao item a qual você poderá utilizar na composição da mensagem.
            Porém, fique a vontade para usar seu atendimento humanizado e compor
            a sua mensagem.
          </Paragraph>
          <Paragraph className={style.paragraph}>
            Lembre-se de se comunicar como “nós do Banco do Brasil” ou como “a
            gente do BB” e não como “eu” ou “ nós da equipe tal”.
          </Paragraph>
        </Card>
      </Col>

      <Col span={12} offset={1} style={{ marginBottom: 30 }}>
        <Row>
          <Col span={24}>
            <RichEditorCarta
              updateFunc={props.updateFunc}
              txtCarta={props.txtCarta}
            />
          </Col>
          <Col style={{ display: "flex", marginTop: 10 }} span={24}>
            <ButtonPrintPdf
              showLayoutConfirm={false}
              buttonText="Visualizar PDF"
              document={() => (
                <CartaPDF
                  txt={remove_tags(props.txtCarta)}
                  orientation={"landscape"}
                />
              )}
              filename={"carta"}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Carta;
