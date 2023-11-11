import {
  Button,
  DatePicker,
  Form,
  Typography,
  message
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

import { FormWithLabelNoWrap } from '@/pages/procuracoes/innerComponents/shared/FormWithLabelNoWrap';
import { useSpinning } from 'components/SpinningContext';
import { CustoFormItems } from 'pages/procuracoes/innerComponents/shared/CustoFormItems';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

import { usePesquisaItemAcordeaoContext } from '../../PesquisaItemAcordeaoContext';
import { extractIdSubsidiaria, getCustoCopia } from './custos';
import { returnErrors } from './returnErrors';

/**
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 * }} props
 */
export function CopiaAutenticadaForm({ idProcuracao, cartorioId }) {
  const outorgado = usePesquisaItemAcordeaoContext();

  return (
    <CopiaAutenticadaFormInner
      cartorioId={cartorioId}
      idProcuracao={idProcuracao}
      idSubsidiaria={
        extractIdSubsidiaria(/** @type {Procuracoes.Procuracao} */(outorgado.procuracao[0]), idProcuracao)
      }
      prefixoCusto={outorgado.prefixo}
      idSolicitacao={null}
      postCb={() => { }}
    />
  );
}

/**
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  idSubsidiaria: number|null,
 *  prefixoCusto: string,
 *  idSolicitacao: number|null,
 *  postCb: () => void,
 * }} props
 */
export function CopiaAutenticadaFormInner({
  idProcuracao,
  idSubsidiaria,
  cartorioId,
  prefixoCusto,
  idSolicitacao,
  postCb,
}) {
  const [form] = /** @type {typeof Form.useForm<{ dataEmissao: Date, custo: number, prefixoCusto: number, superCusto: boolean, zerarCusto: boolean, }>} */(Form.useForm)();
  const { setLoading } = useSpinning();
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    const errors = returnErrors(form);

    if (errors.length > 0) {
      return errors.forEach((e) => message.error(e, 2));
    }

    setLoading(true);

    return postData({
      ...form.getFieldsValue(),
      idProcuracao,
      cartorioId,
      idSolicitacao,
    })
      .then(() => {
        message.success('Cópia Autenticada salva com sucesso.');
        setSent(true);
        form.resetFields();
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
      data-testid="copia-autenticada-form"
      initialValues={{
        prefixoCusto,
        custo: getCustoCopia(idSubsidiaria),
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
      <CustoFormItems
        key="copia-autenticada-form"
        form={form}
      />
      <Button
        onClick={onSubmit}
        disabled={sent}
      >
        {sent ? 'Registro já salvo' : 'Confirmar Cópia'}
      </Button>
    </FormWithLabelNoWrap>
  );
}

/**
 * @param {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  dataEmissao: Date,
 *  custo: number,
 *  superCusto: boolean,
 *  zerarCusto: boolean,
 *  prefixoCusto: number,
 *  idSolicitacao: number|null,
 * }} props
 */
async function postData({
  idProcuracao,
  cartorioId,
  dataEmissao,
  custo,
  superCusto,
  zerarCusto,
  prefixoCusto,
  idSolicitacao,
}) {
  return fetch(
    FETCH_METHODS.POST,
    'procuracoes/gerenciar/copia-autenticada',
    {
      idProcuracao,
      cartorioId,
      custo,
      prefixoCusto,
      idSolicitacao,
      superCusto: Number(superCusto ?? 0),
      zerarCusto: Number(zerarCusto ?? 0),
      dataEmissao: new Date(dataEmissao).toISOString(),
    }
  );
}
