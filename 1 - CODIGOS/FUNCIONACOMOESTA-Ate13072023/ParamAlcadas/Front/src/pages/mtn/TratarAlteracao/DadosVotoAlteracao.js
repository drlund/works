import React from "react";
import {
  Col,
  Row,
  Avatar,
  Typography,
  Descriptions,
  message,
} from "antd";
import { downloadAnexoSemRedux } from "services/ducks/Mtn.ducks";
import { UserOutlined } from "@ant-design/icons";
import styles from "./dadosVotoAlteracao.module.scss";
import { getProfileURL } from "utils/Commons";
import LinkHumanograma from "components/LinkHumanograma/LinkHumanograma";
const { Paragraph, Link } = Typography;

const DadosVotoAlteracao = (props) => {
  const { dadosVoto, setLoading } = props;
  return (
    <Row gutter={[0, 20]}>
      <Col offset={1} span={22}>
        <div className={styles.wrapperFunciVoto}>
          <Avatar
            icon={<UserOutlined />}
            size={64}
            src={getProfileURL(dadosVoto.matricula)}
          />
          <div className={styles.wrapperNomeFunciVoto}>
            <LinkHumanograma matriculaFunci={dadosVoto.matricula}>
              {`${dadosVoto.matricula} - ${dadosVoto.nome}`}
            </LinkHumanograma>
          </div>
        </div>
      </Col>
      <Col span={24}>
        <Descriptions bordered>
          <Descriptions.Item span={4} label={"Justificativa"}>
            {dadosVoto.justificativa}
          </Descriptions.Item>
          {dadosVoto.anexos && Array.isArray(dadosVoto.anexos) && (
            <Descriptions.Item span={4} label={"Anexos"}>
              <Paragraph>
                <ul>
                  {dadosVoto.anexos.map((anexo) => {
                    return (
                      <Link
                        onClick={() => {
                          setLoading(true);
                          downloadAnexoSemRedux({
                            idAnexo: anexo.id,
                            fileName: anexo.nomeArquivo,
                            responseHandler: {
                              successCallback: () => {
                                console.log("Baixado");
                                setLoading(false);
                              },
                              errorCallback: () => {
                                message.error("Erro no download");
                                setLoading(false);
                              },
                            },
                          });
                        }}
                      >
                        {" "}
                        {anexo.nomeOriginal}{" "}
                      </Link>
                    );
                  })}
                </ul>
              </Paragraph>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Col>
    </Row>
  );
};

export default DadosVotoAlteracao;
