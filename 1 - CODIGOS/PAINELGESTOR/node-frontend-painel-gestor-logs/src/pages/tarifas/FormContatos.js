import React, { useEffect, useState } from "react";
import { Row, Col, Button, message, Form, Radio, Input } from "antd";
import MaskedInput from "react-text-mask";
import AlfaSort from "utils/AlfaSort";
import SearchTable from "components/searchtable/SearchTable";
// import { PlusOutlined } from "@ant-design/icons";
// import { setTipo } from "services/ducks/Designacao.ducks";

const mascaraTelefone = [
  "(",
  /\d/,
  /\d/,
  ")",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

const columns = [
  {
    dataIndex: "telefone",
    title: "Telefone",
    sorter: (a, b) => AlfaSort(a.id, b.id),
  },
  {
    dataIndex: "tipoContato",
    title: "Tipo",
    sorter: (a, b) => AlfaSort(a.id, b.id),
  },
  {
    dataIndex: "contato",
    title: "Contato",
    sorter: (a, b) => AlfaSort(a.id, b.id),
  },
];

const FormContatos = (props) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const TIPO_PROPRIO = "proprio";
  const TIPO_RECADO = "recado";

  const { contatos, setContatos } = props;

  const [telefone, setTelefone] = useState("");
  const [contato, setContato] = useState("");
  const [tipoContato, setTipoContato] = useState(TIPO_PROPRIO);

  const onAdicionarContato = () => {
    if (!telefone || !tipoContato || !contato) {
      message.error("Preencha todos os campos");
      return;
    }
    setTelefone("");
    setTipoContato(TIPO_PROPRIO);
    setContatos([...contatos, { telefone, tipoContato, contato }]);
  };

  useEffect(() => {
    if (tipoContato === TIPO_PROPRIO) {
      setContato("Próprio");
    }
    if (tipoContato === TIPO_RECADO) {
      setContato("");
    }
  }, [tipoContato]);

  return (
    <Row>
      <Col span={8}>
        <Form {...layout} labelAlign="left">
          <Form.Item label="Telefone">
            <MaskedInput
              style={{ width: 150 }}
              className="ant-input"
              value={telefone}
              mask={mascaraTelefone}
              placeholder="(00) 00000-0000"
              onChange={(event) => setTelefone(event.target.value)}
            />
          </Form.Item>
          <Form.Item label="Tipo Contato">
            <Radio.Group
              value={tipoContato}
              onChange={(e) => {
                const value = e.target.value;
                setTipoContato(value);
              }}
            >
              <Radio value={TIPO_PROPRIO}>Próprio</Radio>;
              <Radio value={TIPO_RECADO}>Recado</Radio>;
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Contato">
            <Input
              style={{ width: 200 }}
              value={contato}
              disabled={tipoContato === TIPO_PROPRIO}
              onChange={(event) => setContato(event.target.value)}
            />
          </Form.Item>
        </Form>
      </Col>
      <Col offset={1} span={2}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button type="primary" size="small" onClick={onAdicionarContato}>
            {">>"}
          </Button>
        </div>
      </Col>
      <Col offset={1} span={12}>
        <SearchTable
          pagination={{ pageSize: 3 }}
          columns={columns}
          dataSource={contatos}
        />
      </Col>
    </Row>
  );
};

export default FormContatos;
