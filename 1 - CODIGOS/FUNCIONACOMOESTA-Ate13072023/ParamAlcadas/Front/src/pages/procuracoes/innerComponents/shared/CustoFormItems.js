import {
  Checkbox,
  Form,
  InputNumber,
  Space,
  Tooltip
} from 'antd';
import { useEffect, useState } from 'react';

import { useProcuracoesControleCusto } from 'pages/procuracoes/hooks/useProcuracoesControleCusto';
import { useSelectCartorio } from '../../contexts/CartorioContext/useSelectCartorio';

/** o cartório da cadeia hoje é exclusivamente o quinto, id salvo 1 */
const defaultCartorioCadeia = 1;

/**
 * @param {{
 *  hasCadeia?: boolean,
 *  podeZerarCusto?: boolean,
 *  form?: import('antd').FormInstance,
 * }} props
 */
export const CustoFormItems = ({
  hasCadeia = false,
  podeZerarCusto = false,
  form = null
}) => {
  const [requiredCusto, setRequiredCusto] = useState(/** @type {boolean} */(form?.getFieldValue('zerarCusto') ?? true));
  const superCusto = useProcuracoesControleCusto();
  const { SelectCartorio } = useSelectCartorio(
    defaultCartorioCadeia,
    (c) => form?.setFieldValue('cartorioCadeia', c?.id)
  );

  useEffect(() => {
    form?.validateFields(['custo', 'custoCadeia']);
  }, [requiredCusto, form]);

  const handleCheckboxChange = (/** @type {import('antd/lib/checkbox').CheckboxChangeEvent} */ { target: { checked } }) => {
    setRequiredCusto(!checked);
    if (checked === true) {
      form?.setFieldValue('custo', 0);
    }
  };

  const custoValidator = (/** @type {any} */ _, /** @type {any} */ value) => {
    if (requiredCusto && Number(value) < 0.01) {
      return Promise.reject('Custo inválido.');
    }

    return Promise.resolve();
  };

  return (<>
    <Form.Item
      label="Valor de Emissão"
      tooltip="Valor da despesa."
      required
    >
      <Space>
        <Form.Item
          name="custo"
          noStyle
          rules={[{
            required: requiredCusto,
            validator: custoValidator
          }]}
        >
          <InputNumber
            addonBefore="R$"
            // @ts-ignore
            min={0}
            step={0.1}
            disabled={!requiredCusto}
            formatter={toCurrencyLikeNumber}
            aria-label='valor'
          />
        </Form.Item>
        {podeZerarCusto && (
          <Form.Item
            name="zerarCusto"
            valuePropName="checked"
            initialValue={false}
            noStyle
          >
            <Checkbox onChange={handleCheckboxChange}>
              Não houve valor.
            </Checkbox>
          </Form.Item>
        )}
        {superCusto && (
          <Form.Item
            name="superCusto"
            valuePropName="checked"
            initialValue
            noStyle
          >
            <Checkbox>Valores a serem gerenciados pela Super</Checkbox>
          </Form.Item>
        )}
      </Space>
    </Form.Item>
    {
      // custo separado da cadeia apenas para emissão controlada pela super
      // custo de cadeia pode ser em cartório separado da cadeia
      (hasCadeia && superCusto) && (
        <Form.Item
          label="Custo da Cadeia"
          tooltip="Custo da Emissão das outras procurações na cadeia."
          required
          rules={[{
            required: true,
          }]}
        >
          <Space>
            <Form.Item
              name="custoCadeia"
              noStyle
              rules={[{
                required: true,
                validator: custoValidator
              }]}
            >
              <InputNumber
                addonBefore="R$"
                // @ts-ignore
                min={0}
                step={0.1}
                formatter={toCurrencyLikeNumber}
                aria-label='custo da cadeia'
              />
            </Form.Item>
            <Space>
              <Tooltip title="Cartório da Cadeia de Procuração.">
                <span>Cartório:</span>
              </Tooltip>
              <Form.Item
                name='cartorioCadeia'
                noStyle
                rules={[{
                  required: true,
                }]}
              >
                <SelectCartorio />
              </Form.Item>
            </Space>
          </Space>
        </Form.Item>
      )
    }
    <Form.Item
      name="prefixoCusto"
      label="Dependência de Débito"
      tooltip="Prefixo onde ocorre o débito da despesa."
      rules={[{ required: true, min: 1, max: 9999, pattern: /\d{1,4}/ }]}
    >
      <InputNumber
        min={1}
        max={9999}
        step={1}
        formatter={(value) => `${value}`.replace(/\D/g, '').substring(0, 4)}
        // @ts-expect-error antd problem
        parser={(value) => `${value}`.replace(/\D/g, '').substring(0, 4)}
      />
    </Form.Item>
  </>);
};


/**
 * @param {string} value
 * @param {{ userTyping: boolean }} opts
 */
export function toCurrencyLikeNumber(value, { userTyping }) {
  if (userTyping) {
    return value;
  }
  return Number(value).toFixed(2);
}
