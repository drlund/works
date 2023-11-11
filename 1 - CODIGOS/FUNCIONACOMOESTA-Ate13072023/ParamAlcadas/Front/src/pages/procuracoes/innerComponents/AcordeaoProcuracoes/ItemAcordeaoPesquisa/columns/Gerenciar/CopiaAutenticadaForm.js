import {
  Button,
  DatePicker,
  Form,
  Typography,
  message
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useSpinning } from 'components/SpinningContext';
import { CustoFormItems } from 'pages/procuracoes/innerComponents/shared/CustoFormItems';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

import { usePesquisaItemAcordeaoContext } from '../../PesquisaItemAcordeaoContext';
import { extractIdSubsidiaria, getCustoCopia } from './custos';

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
export function CopiaAutenticadaForm({ idProcuracao, cartorioId }) {
  const [form] = /** @type {typeof Form.useForm<{ dataEmissao: Date, custo: number, prefixoCusto: number, superCusto: boolean }>} */(Form.useForm)();
  const { setLoading } = useSpinning();
  const outorgado = usePesquisaItemAcordeaoContext();
  const [sent, setSent] = useState(false);

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

    return postData({
      ...form.getFieldsValue(),
      idProcuracao,
      cartorioId,
    })
      .then(() => {
        message.success('Cópia Autenticada salva com sucesso.');
        setSent(true);
        form.resetFields();
      })
      .catch((err) => message.error(`Erro encontrado: ${err}.`))
      .finally(() => setLoading(false));
  };

  return (
    <FormWithLabelNoWrap
      {...layout}
      form={form}
      data-testid="copia-autenticada-form"
      initialValues={{
        custo: getCustoCopia(extractIdSubsidiaria(outorgado.procuracao[0], idProcuracao)),
        prefixoCusto: outorgado.prefixo,
        dataEmissao: moment(),
      }}
    >
      <Typography.Title level={3}>Cópia Autenticada</Typography.Title>
      <Form.Item
        name="dataEmissao"
        label="Data de Emissão da Cópia"
        rules={[{ required: true }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>
      <CustoFormItems key="copia-autenticada-form" />
      <Button
        onClick={onSubmit}
        disabled={sent}
      >
        {sent ? 'Registro já salvo' : 'Confirmar Cópia'}
      </Button>
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
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  dataEmissao: Date,
 *  custo: number,
 *  superCusto: boolean,
 *  prefixoCusto: number,
 * }} props
 */
async function postData({
  idProcuracao,
  cartorioId,
  dataEmissao,
  custo,
  superCusto,
  prefixoCusto,
}) {
  return fetch(
    FETCH_METHODS.POST,
    'procuracoes/gerenciar/copia-autenticada',
    {
      idProcuracao,
      cartorioId,
      custo,
      prefixoCusto,
      superCusto: Number(superCusto ?? 0),
      dataEmissao: new Date(dataEmissao).toISOString(),
    }
  );
}
