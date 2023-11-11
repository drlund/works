import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Upload,
  message
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { DEVOnlyNotProduction } from 'components/DEVOnlyNotProduction';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';
import { CustoFormItems } from 'pages/procuracoes/innerComponents/shared/CustoFormItems';

import { InputURLDocumento } from './devtools/InputURLDocumento';
import { tiposEtapa } from './tiposEtapa';
import { verificaTipoEtapa } from './verificaTipoEtapa';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

/**
 * @typedef {import('./tiposEtapa').TiposEtapa[keyof import('./tiposEtapa').TiposEtapa]} TipoEtapa
 * @typedef {Procuracoes.DocumentoProcuracao['arquivoProcuracao']} ArquivoProcuracao
 */

/**
 * @param {{
 *  tipoEtapa?: TipoEtapa,
 *  isSubsidiaria?: boolean,
 *  } &
 *  Procuracoes.CurrentStepParameters<Procuracoes.DocumentoProcuracao>
 * } props
 */
export const EtapaDadosProcuracao = ({
  subtrairStep, adicionarStep, dadosEtapa, tipoEtapa = null, isSubsidiaria
}) => {
  verificaTipoEtapa(tipoEtapa);
  const [form] = Form.useForm();

  const { dadosProcuracao: { outorgado } } = useCadastroProcuracao();
  const user = useUsuarioLogado();

  const [urlDocumento, setUrlDocumento] = useState(/** @type {string} */(null));
  const [arquivoProcuracao, setArquivoProcuracao] = useState(/** @type {ArquivoProcuracao}} */(null));

  const isParticular = tipoEtapa === tiposEtapa.particular;
  const hasCadeia = tipoEtapa === tiposEtapa.publica && !isSubsidiaria;
  useEffect(() => {
    if (dadosEtapa) {
      form.setFieldsValue({
        dataEmissao: dadosEtapa.dataEmissao,
        dataVencimento: dadosEtapa.dataVencimento,
        dataManifesto: dadosEtapa.dataManifesto,
        custo: dadosEtapa.custo,
        custoCadeia: dadosEtapa.custoCadeia,
        prefixoCusto: dadosEtapa.prefixoCusto,
        folha: dadosEtapa.folha,
        livro: dadosEtapa.livro,
      });

      if (dadosEtapa.arquivoProcuracao) {
        setArquivoProcuracao(dadosEtapa.arquivoProcuracao);
        setUrlDocumento(null);
      }

      if (dadosEtapa.urlDocumento) {
        setArquivoProcuracao(null);
        setUrlDocumento(dadosEtapa.urlDocumento);
      }
    }
  }, [dadosEtapa, form]);

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
  };

  /**
   * @param {{ onSuccess: (x: any) => void }} props
   */
  const handleUploadFinished = ({ onSuccess }) => {
    // Hack para dizer ao componente que o arquivo foi carregado com sucesso
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const handleProximo = () => {
    const errors = /** @type {string[]} */ (form.getFieldsError().map((f) => f.errors).flat(Infinity));
    if (errors.length > 0) {
      return errors.forEach((s) => message.error(s));
    }
    return adicionarStep({
      ...form.getFieldsValue(),
      arquivoProcuracao,
      urlDocumento,
    });
  };

  const InfosProcuracaoPublica = useCallback(() => (
    <>
      <Form.Item
        name="dataManifesto"
        label="Data Manifesto de Assinaturas"
        rules={[{ required: true }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item name="livro" label="Livro" rules={[{ required: true, max: 50 }]}>
        <Input style={{ width: '25%' }} />
      </Form.Item>
      <Form.Item name="folha" label="Folha" rules={[{ required: true, max: 50 }]}>
        <Input style={{ width: '25%' }} />
      </Form.Item>
    </>
  ), []);

  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <FormWithLabelNoWrap
          {...layout}
          form={form}
          initialValues={{
            custo: isParticular ? 0 : 52.92,
            custoCadeia: hasCadeia ? 42.22 : 0,
            prefixoCusto: outorgado?.prefixoLotacao || user.prefixo,
          }}>
          <Form.Item
            name="dataEmissao"
            label="Data de emissão"
            rules={[{ required: true }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="dataVencimento"
            label="Data de vencimento"
            rules={[{ required: true }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          {
            (tipoEtapa === tiposEtapa.publica)
              ? <InfosProcuracaoPublica />
              : null
          }
          <CustoFormItems
            hasCadeia={hasCadeia}
            podeZerarCusto={isParticular}
            form={form}
          />
          <Form.Item label="Arquivo" rules={[{ required: true }]}>
            <Space align="center">
              <Upload
                showUploadList={false}
                multiple={false}
                disabled={urlDocumento !== null}
                onChange={handleUpload}
                // @ts-ignore
                customRequest={handleUploadFinished}
                accept=".pdf"
              >
                <Button
                  icon={<UploadOutlined />}
                  disabled={urlDocumento !== null}
                >
                  Enviar arquivo
                </Button>
              </Upload>
              <DEVOnlyNotProduction>
                <InputURLDocumento
                  tipoEtapa={tipoEtapa}
                  form={form}
                  arquivoProcuracao={arquivoProcuracao}
                  urlDocumento={urlDocumento}
                  setUrlDocumento={setUrlDocumento}
                />
              </DEVOnlyNotProduction>
            </Space>
            {arquivoProcuracao?.file && (
              <div>
                <Space>
                  <Button type="link">{arquivoProcuracao.file.name}</Button>
                  <DeleteOutlined
                    onClick={() => setArquivoProcuracao(null)}
                    style={{ color: 'red', cursor: 'pointer' }}
                  />
                </Space>
              </div>
            )}
          </Form.Item>
        </FormWithLabelNoWrap>
      </Col>
      <Col span={24}>
        <Space>
          {subtrairStep && (
            <Button type="default" onClick={subtrairStep}>
              Anterior
            </Button>
          )}
          {adicionarStep && (
            <Button
              type="default"
              onClick={handleProximo}
            >
              Próximo
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};

const FormWithLabelNoWrap = styled(Form)`
  & .ant-form-item-label {
    white-space: normal;
    text-align: start;
  }
`;
