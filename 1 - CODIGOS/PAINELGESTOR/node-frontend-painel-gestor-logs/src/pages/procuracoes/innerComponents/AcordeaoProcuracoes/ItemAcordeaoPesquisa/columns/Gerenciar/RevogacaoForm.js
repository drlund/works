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

import { FormWithLabelNoWrap } from '@/pages/procuracoes/innerComponents/shared/FormWithLabelNoWrap';
import { useSpinning } from 'components/SpinningContext';
import { CustoFormItems } from 'pages/procuracoes/innerComponents/shared/CustoFormItems';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

import { usePesquisaItemAcordeaoContext } from '../../PesquisaItemAcordeaoContext';
import { returnErrors } from './returnErrors';

/**
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 * }} props
 */
export function RevogacaoForm({ idProcuracao, cartorioId }) {
  const outorgado = usePesquisaItemAcordeaoContext();

  return (
    <RevogacaoFormInner
      cartorioId={cartorioId}
      idProcuracao={idProcuracao}
      prefixoCusto={outorgado.prefixo}
      idSolicitacao={null}
      successMessage='Revogação salva com sucesso. Recarregue a página para ver as alterações.'
      postCb={() => { }}
    />
  );
}

/**
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  prefixoCusto: string,
 *  idSolicitacao: number|null,
 *  successMessage?: string,
 *  postCb: () => void,
 * }} props
 */
export function RevogacaoFormInner({
  idProcuracao,
  cartorioId,
  prefixoCusto,
  idSolicitacao,
  successMessage = 'Revogação salva com sucesso.',
  postCb,
}) {
  /**
   * @typedef {{dataRevogacao: Date; custo: number; prefixoCusto: number; superCusto: boolean; zerarCusto: boolean}} FormTypes
   */

  const [form] = /** @type {typeof Form.useForm<FormTypes>} */(Form.useForm)();
  const { setLoading } = useSpinning();
  const [arquivoProcuracao, setArquivoProcuracao] = useState(/** @type {ArquivoProcuracao|null} */(null));
  const [sent, setSent] = useState(false);

  /**
   * @param {import('antd/lib/upload').UploadChangeParam<import('antd').UploadFile<any>>} uploadEvent
   */
  const handleUpload = (uploadEvent) => {
    const { originFileObj } = uploadEvent.file;

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setArquivoProcuracao({
        file: /** @type {NonNullable<typeof originFileObj>} */(originFileObj),
        url: /** @type {NonNullable<typeof fileReader.result>} */(fileReader.result)
      });
    };
    fileReader.readAsDataURL(/** @type {NonNullable<typeof originFileObj>} */(originFileObj));

    form.setFieldValue('arquivo', /** @type {NonNullable<typeof originFileObj>} */(originFileObj).name);
  };

  const onSubmit = () => {
    const errors = returnErrors(form);

    if (errors.length > 0) {
      return errors.forEach((e) => message.error(e, 2));
    }

    setLoading(true);

    return postData({
      ...form.getFieldsValue(),
      arquivoProcuracao,
      idProcuracao,
      cartorioId,
      idSolicitacao,
    })
      .then(() => {
        message.success(successMessage);
        setSent(true);
        form.resetFields();
        setArquivoProcuracao(null);
        postCb();
      })
      .catch((err) => message.error(`Erro encontrado: ${err}.`))
      .finally(() => setLoading(false));
  };

  return (
    <FormWithLabelNoWrap
      lineheightvariant
      labelCol={{ span: 6 }}
      form={form}
      data-testid="revogacao-form"
      initialValues={{
        prefixoCusto,
        custo: 31.40,
        dataRevogacao: moment(),
      }}
    >
      <Typography.Title level={3}>Revogação de Procuração</Typography.Title>
      <Form.Item
        name="dataRevogacao"
        label="Data da Revogação"
        rules={[{ required: true }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>
      <CustoFormItems
        key="revogacao-form"
        form={form}
      />
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
            // por padrão é chamado um post na
            // mesma página ao enviar um arquivo
            customRequest={() => { }}
            accept=".pdf"
            data-testid="uploadRevogacao"
          >
            <Button
              icon={<UploadOutlined />}
            >
              Enviar Revogação
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
        Confirmar Revogação
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

/**
 * @typedef {{ file: import('antd/lib/upload').RcFile, url: string | ArrayBuffer }} ArquivoProcuracao
 */

/**
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  dataRevogacao: Date,
 *  custo: number,
 *  superCusto: boolean,
 *  zerarCusto: boolean,
 *  prefixoCusto: number,
 *  arquivoProcuracao: ArquivoProcuracao|null,
 *  idSolicitacao: number|null,
 * }} props
 */
async function postData({
  idProcuracao,
  cartorioId,
  dataRevogacao,
  custo,
  superCusto,
  zerarCusto,
  prefixoCusto,
  arquivoProcuracao,
  idSolicitacao,
}) {
  const data = new FormData();

  data.append('idProcuracao', String(idProcuracao));
  data.append('cartorioId', String(cartorioId));
  data.append('custo', String(custo));
  data.append('superCusto', String(Number(superCusto ?? 0)));
  data.append('zerarCusto', String(Number(zerarCusto ?? 0)));
  data.append('prefixoCusto', String(prefixoCusto));
  data.append('dataRevogacao', new Date(dataRevogacao).toISOString());
  data.append('arquivoProcuracao', /** @type {NonNullable<typeof arquivoProcuracao>} */(arquivoProcuracao).file);
  data.append('idSolicitacao', String(idSolicitacao));

  return fetch(
    FETCH_METHODS.POST,
    'procuracoes/gerenciar/revogacao',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=12345678912345678;',
      },
    },
  );
}
