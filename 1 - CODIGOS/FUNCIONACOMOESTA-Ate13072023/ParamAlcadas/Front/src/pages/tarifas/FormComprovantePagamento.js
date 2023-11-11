import React, { useState } from "react";
import { Form, Button, Upload, Input, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
// import useSelection from "antd/lib/table/hooks/useSelection";

const FormComprovantePagamento = (props) => {
  const { onRegistrarPagamento } = props;
  const dadosIniciais = {
    dataPagamento: moment(),
    observacoes: "",
    anexos: [],
  };

  const [dadosForm, setDadosForm] = useState(dadosIniciais);

  return (
    <Form layout="horizontal">
      <Form.Item name="dataPagamento" valuePropName="dataPagamento">
        <DatePicker
          style={{ width: 180 }}
          value={dadosForm.dataPagamento}
          disabledDate={(currentDate) => currentDate.isAfter(moment())}
          format="DD/MM/YYYY"
          placeholder={"Data do pagamento"}
          onChange={(data) => {
            setDadosForm({ ...dadosForm, dataPagamento: data });
          }}
        />
      </Form.Item>
      <Form.Item name="observacoes" valuePropName="observacoes">
        <Input.TextArea
          placeholder="Caso seja necessário informe observações que julgue necessário"
          onBlur={(e) => {
            setDadosForm({ ...dadosForm, observacoes: e.target.value });
          }}
          rows={5}
        />
      </Form.Item>
      <Form.Item name="anexos" valuePropName="anexos">
        <Upload
          disabled={props.disabled ? props.disabled : false}
          fileList={dadosForm.anexos}
          customRequest={({ onSuccess }) => {
            //Hack para dizer ao componente que o arquivo foi carregado com sucesso
            setTimeout(() => {
              onSuccess("ok");
            }, 0);
          }}
          onChange={(e) => {
            setDadosForm({ ...dadosForm, anexos: e.fileList });
          }}
          name="logo"
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Selecione os comprovantes</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="enviar" valuePropName="enviar">
        <Button type="primary" onClick={() => onRegistrarPagamento(dadosForm)}>
          Salvar comprovantes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormComprovantePagamento;
