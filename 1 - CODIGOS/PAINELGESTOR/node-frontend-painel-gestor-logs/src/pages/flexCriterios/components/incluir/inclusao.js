import React, { useRef, useState } from 'react';
import { message, Form, Space, Button, Alert } from 'antd';
import { inserirPedidoFlex } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import history from 'history.js';
import { usePermissoesUsuario } from 'pages/flexCriterios/hooks/permissaoAcesso';
import { CardResponsivo, Column } from '../../styles';
import constantes from '../../helpers/constantes';

//Imports de componentes comuns
import Funcionario from '../commons/funcionario';
import Etapas from '../commons/etapas';
import Validacoes from '../commons/validacoes';

//Import componentes Inclusão
import InclusaoPedido from './inclusaoPedido';
import InclusaoPrefixosEnvolvidos from './inclusaoPrefixosEnvolvidos';
import { useEffect } from 'react';

export default function Inclusao() {
  const ref = useRef();
  const [funcionarioEnvolvido, setFuncionarioEnvolvido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const etapaAtual = constantes.solicitar;
  const perfil = usePermissoesUsuario();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (funcionarioEnvolvido?.analise) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [funcionarioEnvolvido?.analise]);

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

  const handleClick = (event) => {
    event.currentTarget.disabled = true;
  };

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
        <Form
          form={form}
          onFinish={incluirPedido}
          style={{ marginBottom: '40px' }}
        >
          <CardResponsivo
            title="Dados da Solicitação"
            actions={[
              <Form.Item>
                <Space>
                  <Button onClick={() => history.goBack()}>Cancelar</Button>
                  <Button
                    onClick={handleClick}
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !funcionarioEnvolvido.prefixoDestino ||
                      !funcionarioEnvolvido.funcaoPretendida ||
                      !funcionarioEnvolvido.analise ||
                      !funcionarioEnvolvido.codOportunidade ||
                      !funcionarioEnvolvido.texted ||
                      !funcionarioEnvolvido.selected
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
                  message="ATENÇÃO: No momento não há vagas para a função informada no prefixo informado, continue o fluxo caso a flexibilização seja para vaga futura."
                  type="info"
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

              {funcionarioEnvolvido?.analise && (
                <>
                  <InclusaoPedido
                    fileList={fileList}
                    addFile={addFile}
                    setFuncionarioEnvolvido={setFuncionarioEnvolvido}
                    funcionarioEnvolvido={funcionarioEnvolvido}
                  />
                </>
              )}
            </Column>
          </CardResponsivo>
        </Form>
      )}
      <div ref={ref} />
    </Column>
  );
}
