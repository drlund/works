import React, { useState, useEffect } from "react";
import { Row, Col, Button, Divider, Input, Spin, Table, message } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import AlfaSort from "utils/AlfaSort";
import { fetchFunciForaRedux } from "services/ducks/Arh.ducks";

const columns = [
  {
    width: "15%",
    title: "Funcionário",
    sorter: (a, b) => AlfaSort(a.nome, b.nome),
    render: (record, text) => {
      return (
        <span>
          {record.matricula} - {record.nome}
        </span>
      );
    },
  },
];

const ListaMatriculasForm = (props) => {
  const { form, updateComplemento } = props;

  const [matriculaDigitada, setMatriculaDigitada] = useState("");
  const [loading, setLoading] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);

  const getFuncionarios = () => {
    if (matriculaDigitada === "" || matriculaDigitada.length < 8) {
      message.error("Matrícula inválida");
      return;
    }

    if (
      funcionarios
        .map((funcionario) => funcionario.matricula)
        .includes(matriculaDigitada)
    ) {
      message.error("Funcionário já incluído");
      return;
    }

    setLoading(true);
    if (matriculaDigitada.charAt(0) === "F") {
      fetchFunciForaRedux(matriculaDigitada)
        .then((dadosFunci) => {
          setFuncionarios([...funcionarios, dadosFunci]);
          setMatriculaDigitada("");
        })
        .catch(() => {
          message.error("Funcionário não encontrado");
        })
        .then(() => {
          setLoading(false);
        });
    } else {
      setFuncionarios([
        ...funcionarios,
        { matricula: matriculaDigitada, nome: "Funcionário Externo" },
      ]);
      setMatriculaDigitada("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form) {
      if (funcionarios.length > 0) {
        form.setFieldsValue({ complemento: funcionarios });
      }
    } else {
      updateComplemento(funcionarios);
    }
  }, [funcionarios, form, updateComplemento]);

  return (
    <Spin spinning={loading}>
      <Row>
        <Col span={24}>
          <React.Fragment>
            <Row gutter={[15, 20]}>
              <Col span={8}>
                <Input
                  onChange={(e) =>
                    setMatriculaDigitada(e.target.value.toUpperCase())
                  }
                  value={matriculaDigitada}
                  maxLength={8}
                  placeholder="Matrícula"
                />
              </Col>
              <Col span={1}>
                <Button
                  loading={loading}
                  onClick={() => getFuncionarios()}
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                />
              </Col>
            </Row>
            <Divider />
            <Table
              rowKey={(record) => record.matricula}
              columns={columns}
              dataSource={funcionarios}
              size="small"
              showHeader={funcionarios.length ? true : false}
            />
          </React.Fragment>
        </Col>
      </Row>
    </Spin>
  );
};

export default ListaMatriculasForm;
