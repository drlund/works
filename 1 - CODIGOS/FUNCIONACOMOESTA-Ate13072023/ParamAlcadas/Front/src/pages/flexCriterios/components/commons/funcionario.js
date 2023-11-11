import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  SendOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import history from 'history.js';
import { getProfileURL } from 'utils/Commons';
import constantes from 'pages/flexCriterios/helpers/constantes';
import { getFuncionario } from 'pages/flexCriterios/apiCalls/flexFuncionariosPrefixosAPICall';
import BBSpining from 'components/BBSpinning/BBSpinning';
import { inserirManifestacao } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import {
  TipografiaCabecalho,
  TituloPrincipalCabecalho,
  ContainerIdentificador,
  Row,
  BaseContainer,
} from '../../styles';
import ModalAvocar from './modalAvocar';
import ModalEncerrar from './modalEncerrar';

const { Search } = Input;

export default function Funcionario({
  acao,
  pedidoFlex,
  setFuncionarioEnvolvido,
  loading = false,
  setLoading,
  perfil,
}) {
  const [cabecalho, setCabecalho] = useState({
    title: (
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => history.push(`/flex-criterios/`)}
      >
        Voltar
      </Button>
    ),
  });
  const [complemento1, setComplemento1] = useState(null);
  const [complemento2, setComplemento2] = useState(null);
  const [isModalEncerrarOpen, setIsModalEncerrarOpen] = useState(false);
  const [isModalAvocarOpen, setIsModalAvocarOpen] = useState(false);

  useEffect(() => {
    if (pedidoFlex) {
      if (acao !== constantes.solicitar) {
        setComplemento1(
          <Row>
            <TipografiaCabecalho>
              Tipo(s) de Solicitação:{' '}
              <Space style={{ fontWeight: 'normal' }}>
                {pedidoFlex?.tiposSolicitacao?.map((tipo) => tipo.nome)}
              </Space>
            </TipografiaCabecalho>
          </Row>,
        );
        setComplemento2(
          <ContainerIdentificador>
            <Typography.Title level={5}>Identificador</Typography.Title>
            <Typography>{pedidoFlex.id}</Typography>
          </ContainerIdentificador>,
        );
      } else {
        setComplemento1(null);
        setComplemento2(null);
      }

      switch (acao) {
        case constantes.solicitar:
          setCabecalho({
            title: (
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => history.push(`/flex-criterios/`)}
                >
                  Voltar
                </Button>
                Selecionar Funcionário
              </Space>
            ),
            extra: /SOLICITANTE|ROOT|ANALISTA|DESPACHANTE/.test(perfil) && (
              <Search
                placeholder="Pesquisar por Matrícula"
                onSearch={(valor) => buscarFuncionario(valor)}
                enterButton
              />
            ),
          });
          break;
        case constantes.analisar:
        case constantes.despachar:
          setCabecalho({
            ...cabecalho,
            extra: (
              <Space>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setIsModalEncerrarOpen(true)}
                >
                  Encerrar
                </Button>
                {(perfil?.includes(constantes.perfilAnalista) ||
                  perfil?.includes(constantes.perfilRoot)) && (
                  <Button
                    icon={<SolutionOutlined />}
                    onClick={() => setIsModalAvocarOpen(true)}
                  >
                    Avocar
                  </Button>
                )}
              </Space>
            ),
          });
          break;
        case constantes.deferir:
        case constantes.manifestar:
        case constantes.finalizar:
          setCabecalho({
            ...cabecalho,
            extra: (
              <Space>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setIsModalEncerrarOpen(true)}
                >
                  Encerrar
                </Button>
              </Space>
            ),
          });
          break;
        default:
          setCabecalho({ ...cabecalho });
          break;
      }
    }
  }, [pedidoFlex, pedidoFlex?.funcionario]);

  const buscarFuncionario = (matriculaInformada) => {
    let matriculaCompleta = matriculaInformada;
    if (matriculaCompleta.length < 8) {
      const matriculaSemF = matriculaCompleta?.padStart(7, '0');
      matriculaCompleta = `F${matriculaSemF}`;
    }
    setLoading(true);
    getFuncionario(matriculaCompleta)
      .then((funcionario) => {
        setFuncionarioEnvolvido(funcionario);
      })
      .catch((error) => {
        setFuncionarioEnvolvido(null);
        message.error(
          error ||
            'Funcionário não localizado. Verifique a matrícula e tente novamente.',
        );
      })
      .finally(() => setLoading(false));
  };

  const gravarManifestacao = (manifestacao) => {
    inserirManifestacao(manifestacao)
      .then(() => {
        if (manifestacao.idDispensa === constantes.dispensaEncerrado) {
          setIsModalEncerrarOpen(false);
          message.success('Pedido encerrado com sucesso.');
          return history.push(`/flex-criterios/`);
        }
        if (manifestacao.idDispensa === constantes.dispensaAvocada) {
          setIsModalAvocarOpen(false);
          message.success('Pedido avocado com sucesso.');
          return history.push(`/flex-criterios/`);
        }

        if (
          manifestacao.idDispensa !== constantes.dispensaAvocada ||
          manifestacao.idDispensa !== constantes.dispensaEncerrado
        ) {
          setIsModalAvocarOpen(false);
          message.success('Parecer Registrado.');
          return history.push(`/flex-criterios/`);
        }

        return history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        if (manifestacao.idDispensa === constantes.dispensaEncerrado) {
          setIsModalEncerrarOpen(false);
        }
        if (manifestacao.idDispensa === constantes.dispensaAvocada) {
          setIsModalAvocarOpen(false);
        }
        message.error(resposta);
      });
  };

  return pedidoFlex ? (
    <>
      <Card {...cabecalho}>
        <BBSpining spinning={loading}>
          {pedidoFlex?.funcionarioEnvolvido ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Row>
                <Avatar
                  size={64}
                  src={getProfileURL(
                    pedidoFlex?.funcionarioEnvolvido?.matricula,
                  )}
                  icon={<UserOutlined />}
                />
                <BaseContainer>
                  <TituloPrincipalCabecalho>
                    {`${pedidoFlex?.funcionarioEnvolvido?.matricula} - ${pedidoFlex?.funcionarioEnvolvido?.nome}`}
                  </TituloPrincipalCabecalho>
                  {complemento1}
                </BaseContainer>
              </Row>
              {complemento2}
            </div>
          ) : (
            !perfil?.includes(
              constantes.perfilExecutante && (
                <Typography.Text>
                  Pesquise um funcionário pela sua matrícula.
                </Typography.Text>
              ),
            )
          )}
        </BBSpining>
      </Card>
      <ModalEncerrar
        isModalEncerrarOpen={isModalEncerrarOpen}
        setIsModalEncerrarOpen={setIsModalEncerrarOpen}
        gravarManifestacao={gravarManifestacao}
        idPedidoFlex={pedidoFlex.id}
      />
      <ModalAvocar
        isModalAvocarOpen={isModalAvocarOpen}
        setIsModalAvocarOpen={setIsModalAvocarOpen}
        gravarManifestacao={gravarManifestacao}
        idPedidoFlex={pedidoFlex.id}
      />
    </>
  ) : null;
}
