import React, { useState } from "react";
import { Row, Col, Form, DatePicker, Select, Input, Button } from "antd";
import { DefaultGutter } from "utils/Commons";
import StyledCard from "components/styledcard/StyledCard";
import RichEditor from "components/richeditor/RichEditor";
import moment from "moment";

const { Option } = Select;

const fontesReacoes = [
  "Redes Sociais",
  "CABB",
  "Ouvidoria",
  "Pessoalmente",
  "Outros",
];

const menuRichEditor = {
  insert: {
    title: "Insert",
    items:
      "image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime",
  },
};

const FormRegistroReacao = (props) => {
  const { registrarReacao } = props;
  const [formData, setFormData] = useState({});

  return (
    <Row gutter={DefaultGutter}>
      <Col span={24}>
        <StyledCard className="elogio-card">
          <Form>
            <Row gutter={DefaultGutter}>
              <Col span={4}>
                <Form.Item labelAlign="left" label="Data da Reação">
                  <DatePicker
                    onChange={(value) => {
                      setFormData({ ...formData, dataReacao: value });
                    }}
                    disabledDate={(currentDate) => {
                      return currentDate.diff(moment()) > 0;
                    }}
                    format="DD/MM/YYYY"
                    showToday={false}
                  />
                </Form.Item>
              </Col>
              <Col span={20}>
                <Form.Item labelAlign="left" label="Fonte da Reação">
                  <Select
                    placeholder="Escolha opção desejada"
                    onChange={(value) => {
                      setFormData({ ...formData, fonteReacao: value });
                    }}
                  >
                    {fontesReacoes.map((fonte) => {
                      return <Option value={fonte}>{fonte}</Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {formData.fonteElogio === "Outros" && (
              <Row>
                <Col span={24}>
                  <Form.Item labelAlign="left" label="Insira a fonte">
                    <Input
                      onChange={(value) => {
                        setFormData({ ...formData, outraFonte: value });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row>
              <Col span={24}>
                <Form.Item
                  labelAlign="left"
                  label="Texto/Imagem(print) da reação - arraste ou cole as imagens para dentro do editor"
                >
                  <RichEditor
                    onBlur={(e) => {
                      setFormData({
                        ...formData,
                        conteudoReacao: e.target.getContent(),
                      });
                    }}
                    menu={menuRichEditor}
                    height={500}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Button
              onClick={() => registrarReacao(formData)}
              style={{ marginTop: 10 }}
              type="primary"
              htmlType="submit"
            >
              Registrar Reação
            </Button>
          </Form>
        </StyledCard>
      </Col>
    </Row>
  );
};

export default FormRegistroReacao;
