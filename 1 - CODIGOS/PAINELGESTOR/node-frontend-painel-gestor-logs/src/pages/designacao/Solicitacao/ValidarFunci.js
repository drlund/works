import React, { useState } from 'react';
import {
  validarVaga, setDadosAnalise, getOrigem, compareVRDestOrig, analisarOrigDest
} from 'services/ducks/Designacao.ducks';
import {
  Card, Row, Col, Form, Button, message, Modal, Typography, Alert
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'uuid/v4';
import _ from 'lodash';
import moment from 'moment';

import { DefaultGutter } from 'utils/Commons';
import useEffectOnce from 'utils/useEffectOnce';

import InputFunci from 'components/inputsBB/InputFunciDesigInt';
import PageLoading from 'components/pageloading/PageLoading';

import { Origem, Destino, Resultado } from './ValidarFunciComp';
import Constants from '../Commons/Constants';

const { TEXTO_HIERARQUIA } = Constants();

const { Text, Title } = Typography;

function FrameFunci(props) {
  const dispatch = useDispatch();

  const dtIni = useSelector(({ designacao }) => designacao.dt_ini);
  const dtFim = useSelector(({ designacao }) => designacao.dt_fim);

  const [destino, setDestino] = useState();
  const [funci, setFunci] = useState();
  const [funciKey, setFunciKey] = useState(uuid());
  const [origem, setOrigem] = useState();
  const [analise, setAnalise] = useState();
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [, setIsHierarquia] = useState(null);

  useEffectOnce(() => {
    dispatch(validarVaga())
      .then((prefDestino) => {
        setDestino(prefDestino);
      })
      .catch(() => message.error('Não foi possível Recuperar os dados da Vaga'));
  });

  const openModalErroFunciDecenso = () => {
    Modal.error({
      title: 'Funcionário em Decenso',
      content: 'O VR da função de destino é menor que o VR atual do funcionário selecionado!',
    });
  };

  const openModalErroFunciMesmoPrefixo = () => {
    Modal.error({
      title: 'Funcionário do mesmo Prefixo',
      content: 'Seleção de Funcionário de mesmo Prefixo para Adição!',
    });
  };

  const openModalErroUorFunciSemEnderecoMestre = () => {
    Modal.error({
      title: 'UOR de Trabalho do Funcionário sem Endereço no Mestre',
      content: 'A UOR de trabalho do funcionário selecionado não possui endereço vinculado no Mestre. Para continuar, faz-se necessário a inclusão do endereço na UOR ou mudança da UOR de trabalho do Funcionário. As informações cadastradas estarão disponíveis no dia útil posterior à atualização no Mestre ou ARH!',
    });
  };

  const formaHierarquia = () => {
    const destroy = () => {
      setIsHierarquia(true);
      clear();
      Modal.destroyAll();
    };

    Modal.error({
      title: 'Movimentação Formará Hierarquia entre Parentes',
      content: 'O funcionário escolhido formará hierarquia entre parentes, o que é vedado pelos Normativos Vigentes.'
        + ' Por favor, selecione outro funcionário!',
      afterClose: destroy()
    });

    // Modal.destroyAll();
  };

  const naoFormaHierarquia = () => {
    const destroy = () => {
      setIsHierarquia(false);
    };

    destroy();
  };

  const modalFunciHierarquia = () => {
    Modal.confirm({
      bodyStyle: { padding: '5 5', textAlign: 'justify' },
      centered: true,
      width: '35%',
      title: 'Movimentação Formará Hierarquia entre Parentes?',
      icon: <ExclamationCircleOutlined />,
      content: TEXTO_HIERARQUIA,
      okText: 'SIM (ESCOLHER OUTRO FUNCI)',
      okType: 'danger',
      cancelText: 'NÃO (CONTINUAR)',
      cancelButtonProps: { type: 'primary' },
      onOk() {
        formaHierarquia();
        return true;
      },
      onCancel() {
        naoFormaHierarquia();
        return false;
      },
    });
  };

  const clear = () => {
    setFunciKey(uuid());
    setFunci();
    setOrigem();
    setDadosAnalise();
    setAnalise();
    setIsConfirmButtonDisabled(true);
  };

  const filtro = (func) => {
    if (props.tipo.id === 1) {
      compareVRDestOrig(func, destino.cod_comissao)
        .then((resultado) => {
          if (!resultado) {
            openModalErroFunciDecenso();
          } else {
            getOrigem(func)
              .then((orig) => {
                setFunci(func);
                setFunciKey(uuid());
                setOrigem(orig);
                if (_.isNull(orig.municipio)) {
                  openModalErroUorFunciSemEnderecoMestre();
                } else if (!modalFunciHierarquia()) {
                  analisarDemanda(orig);
                }
              });
          }
        })
        .catch((err) => message.error(err));
    } else {
      getOrigem(func)
        .then((orig) => {
          if (orig.prefixo === destino.prefixo) {
            openModalErroFunciMesmoPrefixo();
          } else {
            setFunci(func);
            setFunciKey(uuid());
            setOrigem(orig);
            if (_.isNull(orig.municipio)) {
              openModalErroUorFunciSemEnderecoMestre();
            } else if (!modalFunciHierarquia()) {
              analisarDemanda(orig);
            }
          }
        })
        .catch((err) => message.error(err));
    }
  };

  const onFunciChange = (func) => {
    clear();

    if (func) {
      filtro(func);
    }
  };

  const analisarDemanda = (thisOrigem) => {
    analisarOrigDest({ destino, origem: thisOrigem })
      .then((dadosAnalise) => {
        setAnalise(dadosAnalise);
        setIsConfirmButtonDisabled(false);

        message.success('Análise Efetuada!');
      })
      .catch(() => message.error('Não foi possível obter os dados da Análise'));
  };

  const next = () => {
    openModalConfirmacao();
  };

  const confirmar = (e) => {
    e.preventDefault();
    gravarEAvancar();
  };

  const gravarEAvancar = () => {
    setConfirmLoading(true);

    dispatch(setDadosAnalise(analise))
      .then(() => {
        setModalConfirmVisible(false);
        setConfirmLoading(false);
        props.next();
      })
      .catch((err) => message.error(err));
  };

  function ConteudoModal() {
    if (!analise) {
      return null;
    }

    if (_.isEmpty(analise.negativas)) {
      return (
        <Row>
          <Col>
            <Alert
              key={moment().valueOf()}
              type="success"
              message={(
                <>
                  <Text>A Análise não apresentou inconsistências!</Text>
                  <p />
                  <Text>Clique em </Text>
                  <Text strong>PRÓXIMO</Text>
                  <Text> para ACESSAR a janela de confirmação, onde você poderá enviar</Text>
                  <Text> informações adicionais e Salvar a Solicitação</Text>
                  <br />
                  <Text> ou em </Text>
                  <Text strong>Voltar</Text>
                  <Text> para retornar e selecionar outro Funcionário.</Text>
                </>
              )}
            />
            {
              analise.admin && (
                <Alert
                  key={moment().add(1, 'day').valueOf()}
                  type="success"
                  message={(
                    <>
                      <p />
                      <Text>Ao clicar em </Text>
                      <Text strong>PRÓXIMO</Text>
                      <Text>, você expressa sua manifestação </Text>
                      <Text strong>DE ACORDO</Text>
                      <Text> com a movimentação transitória referente a essa solicitação, </Text>
                      <Text>como consta no resumo abaixo.</Text>
                      <p />
                      <Card title={<Title level={3}>Resumo da Movimentação</Title>}>
                        <Row>
                          <Col span={6}>Prefixo:</Col>
                          <Col span={18}>
                            <Text strong>
                              {analise.destino.prefixo}
                              {' '}
                              {analise.destino.dependencia}
                            </Text>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={6}>Função:</Col>
                          <Col span={18}>
                            <Text strong>
                              {analise.destino.cod_comissao}
                              {' '}
                              {analise.destino.nome_comissao}
                            </Text>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={6}>Funcionário:</Col>
                          <Col span={18}>
                            <Text strong>
                              {origem.matricula}
                              {' '}
                              {origem.nome}
                            </Text>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={6}>Período:</Col>
                          <Col span={18}>
                            <Text strong>
                              {moment(dtIni).format('DD/MM/YYYY')}
                              {' a '}
                              {moment(dtFim).format('DD/MM/YYYY')}
                            </Text>
                          </Col>
                        </Row>
                      </Card>
                    </>
                  )}
                />
              )
            }
          </Col>
        </Row>
      );
    }
    return (
      <Row>
        <Col>
          <Alert
            key={moment().valueOf()}
            type="warning"
            message={(
              <>
                <Text>A Análise apresentou uma ou mais inconsistências!</Text>
                <p />
                <Text>Clique em </Text>
                <Text strong>PRÓXIMO</Text>
                <Text> para ACESSAR a janela de confirmação, onde você deverá enviar</Text>
                <Text> informações adicionais e Salvar a Solicitação ou em </Text>
                <Text strong>Voltar</Text>
                <Text> para retornar e selecionar outro Funcionário.</Text>
              </>
            )}
          />
          {
            analise.admin && (
              <Alert
                key={moment().add(1, 'day').valueOf()}
                type="success"
                message={(
                  <>
                    <p />
                    <Text>Ao clicar em </Text>
                    <Text strong>PRÓXIMO</Text>
                    <Text>, você expressa sua manifestação </Text>
                    <Text strong>DE ACORDO</Text>
                    <Text> com a movimentação transitória referente a essa solicitação, </Text>
                    <Text>como consta no resumo abaixo.</Text>
                    <p />
                    <Card title={<Title level={3}>Resumo da Movimentação</Title>}>
                      <Row>
                        <Col span={6}>Prefixo:</Col>
                        <Col span={18}>
                          <Text strong>
                            {analise.destino.prefixo}
                            {' '}
                            {analise.destino.dependencia}
                          </Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={6}>Função:</Col>
                        <Col span={18}>
                          <Text strong>
                            {analise.destino.cod_comissao}
                            {' '}
                            {analise.destino.nome_comissao}
                          </Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={6}>Funcionário:</Col>
                        <Col span={18}>
                          <Text strong>
                            {origem.matricula}
                            {' '}
                            {origem.nome}
                          </Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={6}>Período:</Col>
                        <Col span={18}>
                          <Text strong>
                            {moment(dtIni).format('DD/MM/YYYY')}
                            {' a '}
                            {moment(dtFim).format('DD/MM/YYYY')}
                          </Text>
                        </Col>
                      </Row>
                    </Card>
                  </>
                )}
              />
            )
          }
        </Col>
      </Row>
    );
  }

  const openModalConfirmacao = () => {
    setModalConfirmVisible(true);
  };

  const closeModalConfirmacao = () => {
    setModalConfirmVisible(false);
  };

  function ModalConfirmacao() {
    return (
      <Modal
        title="Confirmação do Funcionário Selecionado"
        visible={modalConfirmVisible}
        maskClosable={false}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={confirmar}
        onCancel={closeModalConfirmacao}
        footer={[
          <Button key="back" onClick={closeModalConfirmacao}>
            Voltar
          </Button>,
          <Button key="submit" type="primary" onClick={confirmar}>
            Próximo
          </Button>,
        ]}
      >
        <ConteudoModal />
      </Modal>
    );
  }

  function RenderSelectFunci() {
    const label = `Funcionário a ${props.tipo.verbo}`;

    return (
      <Form.Item
        name="funci"
        label={label}
        required
        tooltip="O sistema faz a consulta por correspondência entre o texto digitado e a matrícula ou o nome do funcionário. Após o sistema retornar os funcionários correspondentes, clique no funcionário desejado para selecioná-lo. Durante a digitação, pressionar <ENTER> cancelará a digitação, limpando o campo de pesquisa!"
      >
        <InputFunci key={funciKey} tipo={props.tipo.id} onChange={onFunciChange} style={{ width: '100%' }} />
      </Form.Item>
    );
  }

  function render() {
    if (destino) {
      return (
        <Card>
          <Form labelAlign="left" layout="vertical">
            <Row gutter={DefaultGutter} align="middle">
              <Col span={12} offset={6}>
                <RenderSelectFunci />
              </Col>
            </Row>
            {
              destino && (
                <>
                  <Row gutter={DefaultGutter} align="middle">
                    <Col span={12}>
                      {
                        origem && <Origem key={funciKey} dados={origem} />
                      }
                    </Col>
                    <Col span={12}>
                      {
                        destino && <Destino key={funciKey} dados={destino} />
                      }
                    </Col>
                  </Row>
                  <Row gutter={DefaultGutter} align="middle">
                    <Col span={12} />
                    <Col span={12}>
                      {
                        analise && <Resultado key={funciKey} dados={analise} />
                      }
                    </Col>
                  </Row>
                </>
              )
            }
            <Row style={{ marginTop: 50 }}>
              {
                funci && (
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Button onClick={next} disabled={isConfirmButtonDisabled} type="primary">Confirmar</Button>
                  </Col>
                )
              }
            </Row>
            <ModalConfirmacao />
          </Form>
        </Card>
      );
    }

    return <PageLoading />;
  }

  return render();
}

export default React.memo(FrameFunci);
