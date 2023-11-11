import React, { useState, useEffect } from "react";
import { Row, Col, Button, Divider, Input, Spin, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AlfaSort from "utils/AlfaSort";
import { fetchDependencia } from "services/ducks/Mestre.ducks";

const columns = [
  {
    width: "15%",
    title: "Prefixo",
    sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo),
    render: (record, text) => {
      return (
        <span>
          {record.prefixo} - {record.nome}
        </span>
      );
    },
  },
];

const ListaPrefixosForm = (props) => {
  const { form, updateComplemento } = props;

  const [prefixoDigitado, setPrefixoDigitado] = useState("");
  const [loading, setLoading] = useState(false);
  const [prefixos, setPrefixos] = useState([]);

  const getPrefixos = () => {
    if (prefixoDigitado === "" || !prefixoDigitado) {
      message.error("Prefixo inválido");
      return;
    }

    if (prefixos.map((prefixo) => prefixo.prefixo).includes(prefixoDigitado)) {
      message.error("Prefixo já incluído");
      return;
    }

    setLoading(true);
    fetchDependencia(prefixoDigitado)
      .then((prefixo) => {
        setPrefixos([...prefixos, prefixo]);
        setPrefixoDigitado("");
      })
      .catch(() => {
        message.error("Prefixo não encontrado");
        setPrefixoDigitado("");
      })
      .then(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (form) {
      if (prefixos.length > 0) {
        form.setFieldsValue({ complemento: prefixos });
      }
    } else {
      updateComplemento(prefixos);
    }
  }, [prefixos, form, updateComplemento]);

  return (
    <Spin spinning={loading}>
      <Row>
        <Col span={24}>
          <React.Fragment>
            <Row gutter={[15, 20]}>
              <Col span={8}>
                <Input
                  onChange={(e) =>
                    setPrefixoDigitado(e.target.value.replace(/\D/g, ""))
                  }
                  value={prefixoDigitado}
                  maxLength={4}
                  placeholder="Prefixo"
                />
              </Col>
              <Col span={1}>
                <Button
                  loading={loading}
                  onClick={() => getPrefixos()}
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                />
              </Col>
            </Row>
            <Divider />
            <Table
              rowKey={(record) => record.prefixo}
              columns={columns}
              dataSource={prefixos}
              size="small"
              showHeader={prefixos.length ? true : false}
            />
          </React.Fragment>
        </Col>
      </Row>
    </Spin>
  );
};

export default ListaPrefixosForm;
