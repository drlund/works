import React from "react";
import { Card, Row, Col, Typography, Input, Upload, Button } from "antd";
import PropTypes from "prop-types";
import InputPrefixo from "../../../components/inputsBB/InputPrefixo";
import DadosCliente from "./DadosCliente";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./descricaoCaso.module.scss";
import "./descricao.fix.css";
import _ from "lodash";
import SelectProdutosBB from "./SelectProdutos";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const DescricaoCaso = (props) => {
  const removeFile = (arquivoRemovido) => {
    const newListaArquivos = props.anexos;
    _.remove(newListaArquivos, (arquivo) => arquivo === arquivoRemovido);
    props.updateFiles(newListaArquivos);
  };

  const addFile = (file) => {
    const newListaArquivos = props.anexos;
    newListaArquivos.push(file);
    props.updateFiles(newListaArquivos);
  };

  const uploadProps = {
    onRemove: removeFile,
    beforeUpload: addFile,
    fileList: props.anexos,
  };

  return (
    <>
      <Row gutter={[10, 50]} align="middle" justify="center">
        <Col className={styles.imgWrapper} span={10}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/saying.jpg`}
            alt="Dois balões de conversa"
          />
        </Col>
        <Col span={10} offset={1} flex={1}>
          <Card>
            <Title level={3}> Conte-nos o que aconteceu.</Title>
            <Paragraph className={styles.paragraph}>
              No campo abaixo, descreva a situação que te levou a querer{" "}
              <Text strong>encantar</Text> este cliente.
            </Paragraph>
            <Paragraph className={styles.paragraph}>
              O mais importante que precisamos saber, é da história que o
              cliente lhe contou e o que você identificou que é valioso para o
              cliente nesse momento.
            </Paragraph>
            <Paragraph className={styles.paragraph}>
              De maneira sucinta, informe a situação/problema que trouxe o
              cliente até o seu atendimento e qual a resolutividade que foi
              dada. Informe o prefixo da dependência do fato, caso seja
              diferente daquele de relacionamento, e informe também qual o
              produto ou serviço BB que deu origem ao fato descrito.
            </Paragraph>
          </Card>
        </Col>

        <Col span={10}>
          <Card>
            <DadosCliente dadosCliente={props.dadosCliente} />
          </Card>
        </Col>
        <Col span={11} offset={1}>
          <Row gutter={[0, 15]}>
            <Col span={9}>
              <InputPrefixo
                placeholder="Selecione o prefixo do fato"
                fullValue
                className={styles.bbinput}
                onChange={(prefixos) => props.updatePrefixoFato(prefixos[0])}
              />
            </Col>
            <Col
              span={11}
              offset={1}
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              {props.prefixoFato && props.prefixoFato.prefixo !== undefined && (
                <p>{`${props.prefixoFato.prefixo} - ${props.prefixoFato.nome}`}</p>
              )}
            </Col>
            <Col span={12}>
              <SelectProdutosBB
                produtoBB={props.produtoBB}
                updateProdutoBB={props.updateProdutoBB}
              />
            </Col>
            <Col span={24}>
              <TextArea
                placeholder="Descreva seu caso aqui"
                allowClear
                value={props.descricao}
                style={{ height: 200 }}
                onChange={(e) => props.updateDescricao(e.target.value)}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 30 }}>
            <Col span={24}>
              <div className="uploadWrapper">
                <Upload {...uploadProps}>
                  <Button>
                    <UploadOutlined /> Incluir Arquivo
                  </Button>
                </Upload>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

DescricaoCaso.propTypes = {
  updatePrefixoFato: PropTypes.func,
};

export default DescricaoCaso;
