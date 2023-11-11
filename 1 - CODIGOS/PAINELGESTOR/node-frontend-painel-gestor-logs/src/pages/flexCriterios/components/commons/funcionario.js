import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, Input, message, Space, Typography } from 'antd';
import {
  ArrowLeftOutlined,
  CloseOutlined,
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

export default function FuncionarioCard({
  acao,
  pedidoFlex,
  setFuncionarioEnvolvido,
  loading = false,
  setLoading,
  perfil,
}) {
  const [complemento1, setComplemento1] = useState(null);
  const [complemento2, setComplemento2] = useState(null);
  const [isModalEncerrarOpen, setIsModalEncerrarOpen] = useState(false);
  const [isModalAvocarOpen, setIsModalAvocarOpen] = useState(false);

  //Função pra descobrir se é gestor destino
  /** @type {{ gestorUnidadeAlvo: string[] }} */
  const foundGestorUnidadeAlvo = perfil?.find(
    (/** @type {{ gestorUnidadeAlvo: string[] }} */ p) => p?.gestorUnidadeAlvo,
  );
  const gestorUnidadeAlvo = foundGestorUnidadeAlvo?.gestorUnidadeAlvo || [];
  const isGestorDestino = gestorUnidadeAlvo?.includes(
    pedidoFlex?.funcionarioEnvolvido?.prefixoDestino?.prefixoDiretoria,
  );

  //Função pra descobrir se é operador destino
  /** @type {{ operadorUnidadeAlvo: string[] }} */
  const foundOperadorUnidadeAlvo = perfil?.find(
    (/** @type {{ operadorUnidadeAlvo: string[] }} */ p) =>
      p?.operadorUnidadeAlvo,
  );
  const operadorUnidadeAlvo =
    foundOperadorUnidadeAlvo?.operadorUnidadeAlvo || [];
  const isOperadorDestino = operadorUnidadeAlvo?.includes(
    pedidoFlex?.funcionarioEnvolvido?.prefixoDestino?.prefixoDiretoria,
  );

  //Cabeçalho inicial com botão voltar
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

  useEffect(() => {
    if (pedidoFlex) {
      //No momento de solicitar, cria as informações do cabeçalho do usuario
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
        //Cabeçalho com os dados pra procurar o funci
        case constantes.solicitar:
          setCabecalho({
            title: (
              <Space direction="vertical">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => history.push(`/flex-criterios/`)}
                >
                  Voltar
                </Button>
                <Space direction="vertical" style={{ marginTop: 20 }}>
                  <Typography.Text> Selecionar Funcionário</Typography.Text>

                  {/SOLICITANTE|ROOT|ANALISTA|DESPACHANTE/.test(perfil) && (
                    <Search
                      style={{ width: '230px' }}
                      placeholder="Pesquisar por Matrícula"
                      onSearch={(valor) => {
                        setLoading(true);
                        setTimeout(() => {
                          buscarFuncionario(valor);
                          setLoading(false);
                        }, 1000);
                      }}
                      onBlur={(valor, e) => {
                        if (!pedidoFlex?.funcionarioEnvolvido?.matricula) {
                          setLoading(true);
                          setTimeout(() => {
                            buscarFuncionario(valor.target.value);
                            setLoading(false);
                          }, 1000);
                        }
                      }}
                      enterButton
                    />
                  )}
                </Space>
              </Space>
            ),
            /*    extra: /SOLICITANTE|ROOT|ANALISTA|DESPACHANTE/.test(perfil) && (
              <Search
                placeholder="Pesquisar por Matrícula"
                onSearch={(valor) => buscarFuncionario(valor)}
                enterButton
              />
            ), */
          });
          break;

        //Cabeçalho de Encerrar, Avocar
        default:
          setCabecalho({
            ...cabecalho,
            extra: (
              <Space>
                {/*   {(/MANIFESTANTE|DEFERIDOR/.test(perfil) ||
                  isGestorDestino ||
                  isOperadorDestino) && (
                  <>
                    <Button
                      icon={<CloseOutlined />}
                      onClick={() => setIsModalEncerrarOpen(true)}
                    >
                      Encerrar
                    </Button>
                  </>
                )} */}
                {isGestorDestino && acao !== constantes.acaoAnalise && (
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
      }
    }
  }, [pedidoFlex, pedidoFlex?.funcionario, isGestorDestino]);

  const buscarFuncionario = (matriculaInformada) => {
    console.log('MATRICULA INFORMADA', matriculaInformada);
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
