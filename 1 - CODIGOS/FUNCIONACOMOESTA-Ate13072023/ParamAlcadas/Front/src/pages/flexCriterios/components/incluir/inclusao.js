import React, { useState } from 'react';
import { message, Form, Space, Button, Alert } from 'antd';
import { inserirPedidoFlex } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import history from 'history.js';
import { usePermissoesUsuario } from 'pages/flexCriterios/hooks/permissaoAcesso';
import { CardResponsivo, Column } from '../../styles';
import Funcionario from '../commons/funcionario';
import constantes from '../../helpers/constantes';
import InclusaoPrefixosEnvolvidos from './inclusaoPrefixosEnvolvidos';
import Validacoes from '../commons/validacoes';
import InclusaoPedido from './inclusaoPedido';
import Etapas from '../commons/etapas';

export default function Inclusao() {
  const [funcionarioEnvolvido, setFuncionarioEnvolvido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const etapaAtual = constantes.solicitar;
  const perfil = usePermissoesUsuario();
  const [fileList, setFileList] = useState([]);

  const incluirPedido = () => {
    const pedidoFlex = JSON.parse(JSON.stringify(funcionarioEnvolvido));
    pedidoFlex.prefixoDestino = JSON.parse(
      JSON.stringify(funcionarioEnvolvido?.prefixoDestino),
    );
    pedidoFlex.oportunidade = form.getFieldValue('oportunidade');
    pedidoFlex.tipoFlex = form.getFieldValue('tipoFlexibilizacao');
    pedidoFlex.justificativa = form.getFieldValue('justificativa');
    pedidoFlex.arquivos = fileList;

    inserirPedidoFlex(pedidoFlex)
      .then(() => {
        message.success(
          'Pedido inserido. Acompanhe pelo menu "Acompanhar Pedido".',
        );
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => message.error(resposta));
  };

  const addFile = (data) => setFileList(data);

  return (
    <Column>
      <Etapas etapaAtual={etapaAtual} />
      <Funcionario
        acao={constantes.solicitar}
        pedidoFlex={{ funcionarioEnvolvido }}
        setFuncionarioEnvolvido={setFuncionarioEnvolvido}
        loading={loading}
        setLoading={setLoading}
        perfil={perfil}
      />
      {funcionarioEnvolvido && (
        <Form form={form} onFinish={incluirPedido}>
          <CardResponsivo
            title="Dados da Solicitação"
            actions={[
              <Form.Item>
                <Space>
                  <Button onClick={() => history.goBack()}>Cancelar</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !funcionarioEnvolvido.prefixoDestino ||
                      !funcionarioEnvolvido.funcaoPretendida ||
                      !funcionarioEnvolvido.analise ||
                      !funcionarioEnvolvido.codOportunidade
                    }
                  >
                    Incluir Solicitação
                  </Button>
                </Space>
              </Form.Item>,
            ]}
          >
            <Column>
              {funcionarioEnvolvido?.existeVagaPretendida == false &&
              funcionarioEnvolvido?.cargoExiste == true ? (
                <Alert
                  message="ATENÇÂO: Não há vagas para a função no prefixo."
                  type="warning"
                  showIcon
                  closable
                />
              ) : null}
              {funcionarioEnvolvido?.cargoExiste == false ? (
                <Alert
                  message="ATENÇÂO: Comissão inexistente no prefixo de destino"
                  type="warning"
                  showIcon
                  closable
                />
              ) : null}

              <InclusaoPrefixosEnvolvidos
                funcionarioEnvolvido={funcionarioEnvolvido}
                setFuncionarioEnvolvido={setFuncionarioEnvolvido}
                setLoading={setLoading}
              />
              <Validacoes
                funcionarioEnvolvido={funcionarioEnvolvido}
                loading={loading}
              />
              <InclusaoPedido fileList={fileList} addFile={addFile} />
            </Column>
          </CardResponsivo>
        </Form>
      )}
    </Column>
  );
}
