import React, { useState } from 'react';
import {
  Card,
  Alert,
  Typography,
  Row,
  Col,
  Modal,
  message,
  Result,
  Button,
  Tooltip,
  Input,
  Space,
} from 'antd';
import _ from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
  setDadosDeAcordo,
  getDadosDeAcordo,
} from 'services/ducks/Designacao.ducks';

import useEffectOnce from 'utils/useEffectOnce';

import PageLoading from 'components/pageloading/PageLoading';

const { Text } = Typography;
const { confirm } = Modal;

const OPCOES = (opt) => ({
  prefixoOrigem: opt.tipo.gestorOrigem && (!opt.situacaoOrigem),
  prefixoDestino: opt.tipo.gestorDestino && (!opt.situacaoDestino),
  prefixoOrigemEDestino: (opt.tipo.gestorDestino && opt.tipo.gestorOrigem)
    && (!opt.situacaoOrigem || !opt.situacaoDestino) && _.isNil(opt.situacaoSuperior),
  instanciaSuperior: (opt.tipo.diretoria || opt.tipo.superiorDestino) && !opt.situacaoSuperior,
});

function DeAcordo(props) {
  const [deAcordo, setDeAcordo] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [texto, setTexto] = useState('');

  const obterDadosDeAcordo = () => {
    const { id } = props;
    getDadosDeAcordo(id)
      .then((dadosDeAcordo) => setDeAcordo(dadosDeAcordo))
      .catch((error) => message.error(error));
  };

  useEffectOnce(() => {
    obterDadosDeAcordo();
    return clean();
  });

  const clean = () => {
    setDeAcordo(null);
    setTexto('');
  };

  const confirmacao = (tipo) => {
    if (tipo === 'negado') {
      if (texto.length < 50) {
        return alerta();
      }
    }
    return concordo(tipo);
  };

  const alerta = () => {
    Modal.warning({
      title: 'Informe o motivo do NÃO DE ACORDO',
      content: 'O campo de texto deve conter o objeto de sua manifestação negativa, mínimo de 50 caracteres!'
    });
  };

  const concordo = (tipo) => {
    const { id } = props;
    if (tipo) {
      const titulo = (tipo === 'negado') ? 'Deseja confirmar sua manifestação de NÃO DE ACORDO com a presente movimentação?' : 'Deseja confirmar sua manifestação de concordância com a presente movimentação?';
      confirm({
        title: `${titulo}`,
        icon: <ExclamationCircleOutlined />,
        onOk() {
          setGravando(true);
          setDadosDeAcordo(id, tipo, texto)
            .then(() => setGravando(false))
            .catch((error) => message.error(error))
            .then(() => setConcluido(true));
        },
        onCancel() {
          message.warning(
            'Você cancelou a manifestação de concordância com a presente movimentação!'
          );
        },
        okText: 'Confirmar',
        cancelText: 'Cancelar',
      });
    }
  };

  const escrevendoTexto = (thisTexto) => {
    setTexto(thisTexto || '');
  };

  const optionsDeAcordo = () => {
    if (!deAcordo || (_.isEmpty(deAcordo.perfil) && !deAcordo.assinado)) {
      return null;
    }
    return deAcordo;
  };

  const renderDeAcordo = () => {
    const { onSave } = props;
    const opcoes = optionsDeAcordo();

    if (_.isEmpty(deAcordo)) {
      return <PageLoading />;
    }

    if (_.isNil(opcoes)) {
      return (
        <Alert
          type="error"
          message={(
            <Text>
              Sua assinatura no Termo de Acordo desta Movimentação
              {' '}
              Transitória NÃO é obrigatória.
            </Text>
          )}
        />
      );
    }

    if (opcoes.assinado) {
      return (
        <Alert
          type="success"
          message={(
            <Text>
              O perfil atual
              {' '}
              {opcoes.perfil}
              {' '}
              já assinou o termo de Acordo,
              {' '}
              concordando com a movimentação referente a esta solicitação.
            </Text>
          )}
        />
      );
    }

    if (concluido) {
      return (
        <Row>
          <Col>
            <Result
              status="success"
              title="Assinatura Gravada com Sucesso!"
              extra={[
                <Button type="primary" key="save" onClick={onSave}>
                  Concluído
                </Button>,
              ]}
            />
          </Col>
        </Row>
      );
    }

    return (
      <Row>
        <Col span={23}>
          <Alert
            type="warning"
            message={
              gravando ? (
                <PageLoading />
              ) : (
                <>
                  <Row>
                    <Col style={{ textAlign: 'justify' }}>
                      <Text>
                        Marque uma das opções abaixo para manifestar seu
                        {' '}
                        De Acordo com a presente solicitação de
                        {' '}
                        movimentação
                      </Text>
                      {
                        opcoes.limitrofes && (
                          <Text>
                            {' '}
                            e a possibilidade de não ter suplementação
                            {' '}
                            orçamentária na sua jurisdição
                          </Text>
                        )
                      }
                      <Text>, enquanto</Text>
                      <Text strong>
                        {' '}
                        {opcoes.perfil}
                      </Text>
                      <Text>
                        . A caixa de texto abaixo pode ser usada para
                        {' '}
                        fazer comentários sobre sua manifestação, porém
                        {' '}
                        só é de preenchimento obrigatório caso sua resposta seja o Não De Acordo.
                      </Text>
                      <p />
                    </Col>
                  </Row>
                  {
                    opcoes.ggSuper
                    && (
                      <Row>
                        <Col>
                          <Text strong>
                            Movimentação Transitória para 1ª Gestor UN/UT
                          </Text>
                          <p />
                        </Col>
                      </Row>
                    )
                  }
                  {
                    opcoes.limitrofes
                    && (
                      <Row>
                        <Col>
                          <Text strong>
                            Movimentação Transitória entre prefixos de municípios NÃO-LIMÍTROFES
                          </Text>
                          <p />
                          <div
                            style={{
                              border: '1px dotted black',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {opcoes.textoLimitrofes}
                          </div>
                          <p />
                        </Col>
                      </Row>
                    )
                  }
                  <Row>
                    <Col>
                      <Input.TextArea
                        maxLength={50000}
                        rows={5}
                        name="texto"
                        onChange={({ target }) => escrevendoTexto(target.value)}
                        placeholder="Comente aqui sua manifestação De Acordo (obrigatório no caso de NÃO DE ACORDO)"
                      />
                      <p />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col>
                      <Space direction="vertical">
                        {
                          (OPCOES(opcoes).prefixoOrigem && !OPCOES(opcoes).prefixoOrigemEDestino)
                          && (
                            <Tooltip title="Manifesta o De Acordo como Gestor do Prefixo de Origem relacionado no perfil">
                              <Button type="primary" block ghost style={{ textAlign: 'left' }} onClick={() => confirmacao('gestorOrigem')}>
                                De Acordo como Gestor do Prefixo de Origem
                              </Button>
                            </Tooltip>
                          )
                        }
                        {
                          (OPCOES(opcoes).prefixoDestino
                            && !OPCOES(opcoes).prefixoOrigemEDestino)
                          && (
                            <Tooltip title="Manifesta o De Acordo como Gestor do Prefixo de Destino relacionado no perfil">
                              <Button type="primary" block ghost style={{ textAlign: 'left' }} onClick={() => confirmacao('gestorDestino')}>
                                De Acordo como Gestor do Prefixo de Destino
                              </Button>
                            </Tooltip>
                          )
                        }
                        {
                          (OPCOES(opcoes).prefixoOrigemEDestino)
                          && (
                            <Tooltip title="Manifesta o De Acordo como Gestor do Prefixo de Origem e de Destino relacionados no perfil">
                              <Button type="primary" block ghost style={{ textAlign: 'left' }} onClick={() => confirmacao('gestorOrigemDestino')}>
                                De Acordo como Gestor do Prefixo de Origem e de Destino
                              </Button>
                            </Tooltip>
                          )
                        }
                        {
                          ([deAcordo?.ggSuper, deAcordo?.limitrofes].includes(true) && OPCOES(opcoes).instanciaSuperior)
                          && (
                            <Tooltip title="Manifesta o De Acordo como Instância Superior dos prefixos relacionados no perfil">
                              <Button type="primary" block ghost style={{ textAlign: 'left' }} onClick={() => confirmacao('superior')}>
                                De Acordo como Instância Superior
                              </Button>
                            </Tooltip>
                          )
                        }
                        <Tooltip title="Manifesta NÃO DE ACORDO com a presente Solicitação">
                          <Button danger type="primary" block style={{ textAlign: 'left' }} onClick={() => confirmacao('negado')}>
                            NÃO DE ACORDO com a presente solicitação
                          </Button>
                        </Tooltip>
                      </Space>
                    </Col>
                  </Row>
                </>
              )
            }
          />
        </Col>
      </Row>
    );
  };

  return (
    <Card
      headStyle={{ fontSize: '2rem', textDecoration: 'bold' }}
      bodyStyle={{ alignContent: 'center' }}
      title="De Acordo"
    >
      {renderDeAcordo()}
    </Card>
  );
}
export default DeAcordo;
