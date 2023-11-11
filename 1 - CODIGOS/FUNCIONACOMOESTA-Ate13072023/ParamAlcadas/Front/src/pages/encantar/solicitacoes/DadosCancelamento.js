import React from "react";
import ReactHtmlParser from "react-html-parser";
import { getProfileURL } from "utils/Commons";
import { Row, Col, Avatar, Card, Comment, Typography } from "antd";
import ListaAnexosEncantar from "pages/encantar/ListaAnexosEncantar";

const { Title } = Typography;
const DadosCancelamento = (props) => {
  const { dadosCancelamento } = props;
  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Comment
          actions={[
            <span key="comment-nested-reply-to">{`Cancelado em ${dadosCancelamento.createdAt}`}</span>,
          ]}
          author={`${dadosCancelamento.funciMatriculaCancelamento} - ${dadosCancelamento.funciNomeCancelamento}`}
          avatar={
            <Avatar
              style={{ verticalAlign: "middle", marginRight: 5, marginTop: 15 }}
              size="large"
              src={getProfileURL(dadosCancelamento.funciMatriculaCancelamento)}
            />
          }
          content={
            <>
              <Card style={{ margin: 5 }}>
                {ReactHtmlParser(dadosCancelamento.motivoCancelamento)}
                {dadosCancelamento.anexos &&
                  dadosCancelamento.anexos.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <Title level={5}> Anexos </Title>
                      <ListaAnexosEncantar anexos={dadosCancelamento.anexos} />
                    </div>
                  )}
              </Card>
            </>
          }
        />
      </Col>
    </Row>
  );
};

export default DadosCancelamento;
