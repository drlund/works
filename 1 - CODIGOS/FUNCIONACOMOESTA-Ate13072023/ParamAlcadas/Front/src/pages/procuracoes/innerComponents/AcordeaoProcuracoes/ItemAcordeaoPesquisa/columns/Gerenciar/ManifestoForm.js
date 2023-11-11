import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Space,
  Typography,
  Upload,
  message
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useSpinning } from 'components/SpinningContext';
import { CustoFormItems } from 'pages/procuracoes/innerComponents/shared/CustoFormItems';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

import { usePesquisaItemAcordeaoContext } from '../../PesquisaItemAcordeaoContext';
import { extractIdSubsidiaria, getCustoManifesto } from './custos';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

/**
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 * }} props
 */
export function ManifestoForm({ idProcuracao, cartorioId }) {
  const [form] = /** @type {typeof Form.useForm<{ dataManifesto: Date, custo: number, prefixoCusto: number, superCusto: boolean }>} */(Form.useForm)();
  const { setLoading } = useSpinning();
  const [arquivoProcuracao, setArquivoProcuracao] = useState(/** @type {ArquivoProcuracao} */(null));
  const [sent, setSent] = useState(false);
  const outorgado = usePesquisaItemAcordeaoContext();

  /**
   * @param {import('antd/lib/upload').UploadChangeParam<import('antd').UploadFile<any>>} uploadEvent
   */
  const handleUpload = (uploadEvent) => {
    const { originFileObj } = uploadEvent.file;

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setArquivoProcuracao({
        file: originFileObj,
        url: fileReader.result
      });
    };
    fileReader.readAsDataURL(originFileObj);

    form.setFieldValue('arquivo', originFileObj.name);
  };

  /** @param {{ onSuccess: (args: unknown) => void }} props */
  const handleUploadFinished = ({ onSuccess }) => {
    // Hack para dizer ao componente que o arquivo foi carregado com sucesso
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  function returnErrors() {
    const empty = Object.entries(form.getFieldsValue())
      .filter(([, v]) => typeof v !== 'boolean' && Boolean(!v))
      .map(([key]) => `${key.toUpperCase()} é obrigatório.`);

    return /** @type {string[]} */ (form.getFieldsError().map((f) => f.errors).flat(Infinity))
      .concat(empty);
  }

  const onSubmit = () => {
    const errors = returnErrors();

    if (errors.length > 0) {
      return errors.forEach((e) => message.error(e, 2));
    }

    setLoading(true);

    // TODO: melhorar experiencia após adição de manifesto
    // Ideia inicial: src/pages/procuracoes/Pesquisar/gerenciarPesquisas.md

    return postData({
      ...form.getFieldsValue(),
      arquivoProcuracao,
      idProcuracao,
      cartorioId,
    })
      .then(() => {
        message.success('Manifesto salvo com sucesso. Recarregue a página para ver as alterações.');
        setSent(true);
        form.resetFields();
        setArquivoProcuracao(null);
      })
      .catch((err) => message.error(`Erro encontrado: ${err}.`))
      .finally(() => setLoading(false));
  };

  return (
    <FormWithLabelNoWrap
      {...layout}
      form={form}
      data-testid="manifesto-form"
      initialValues={{
        custo: getCustoManifesto(extractIdSubsidiaria(outorgado.procuracao[0], idProcuracao)),
        prefixoCusto: outorgado.prefixo,
        dataManifesto: moment(),
      }}
    >
      <Typography.Title level={3}>Certidão de Procuração</Typography.Title>
      <Form.Item
        name="dataManifesto"
        label="Data do Manifesto de Assinaturas"
        rules={[{ required: true }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>
      <CustoFormItems key="manifesto-form" />
      <Form.Item
        name="arquivo"
        label="Documento Atualizado"
        rules={[{ required: true }]}
        required
      >
        <Space align="center">
          <Upload
            showUploadList={false}
            multiple={false}
            onChange={handleUpload}
            // @ts-ignore
            customRequest={handleUploadFinished}
            accept=".pdf"
            data-testid="uploadManifesto"
          >
            <Button
              icon={<UploadOutlined />}
            >
              Enviar Procuração Atualizada
            </Button>
          </Upload>
          {arquivoProcuracao?.file && (
            <Space>
              <Button type="link">{arquivoProcuracao.file.name}</Button>
              <DeleteOutlined
                onClick={() => {
                  setArquivoProcuracao(null);
                  form.setFieldValue('arquivo', null);
                }}
                style={{ color: 'red', cursor: 'pointer' }} />
            </Space>
          )}
        </Space>
      </Form.Item>
      <Button
        onClick={onSubmit}
        disabled={!arquivoProcuracao}
      >
        Confirmar Atualização
      </Button>
      {
        sent && (
          <Typography.Text type='warning' style={{ marginLeft: '2em' }}>
            Recarregue a página para ver as alterações.
          </Typography.Text>
        )
      }
    </FormWithLabelNoWrap>
  );
}

const FormWithLabelNoWrap = styled(Form)`
  & .ant-form-item-label {
    white-space: normal;
    text-align: start;
  }
`;

/**
 * @typedef {{ file: import('antd/lib/upload').RcFile, url: string | ArrayBuffer }} ArquivoProcuracao
 */

/**
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  dataManifesto: Date,
 *  custo: number,
 *  superCusto: boolean,
 *  prefixoCusto: number,
 *  arquivoProcuracao: ArquivoProcuracao,
 * }} props
 */
async function postData({
  idProcuracao,
  cartorioId,
  dataManifesto,
  custo,
  superCusto,
  prefixoCusto,
  arquivoProcuracao,
}) {
  const data = new FormData();

  data.append('idProcuracao', String(idProcuracao));
  data.append('cartorioId', String(cartorioId));
  data.append('custoManifesto', String(custo));
  data.append('superCusto', String(Number(superCusto ?? 0)));
  data.append('prefixoCusto', String(prefixoCusto));
  data.append('dataManifesto', new Date(dataManifesto).toISOString());
  data.append('arquivoProcuracao', arquivoProcuracao.file);

  return fetch(
    FETCH_METHODS.POST,
    'procuracoes/gerenciar/manifesto',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=12345678912345678;',
      },
    },
  );
}
