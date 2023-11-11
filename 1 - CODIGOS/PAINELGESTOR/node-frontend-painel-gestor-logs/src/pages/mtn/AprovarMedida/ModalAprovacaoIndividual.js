import React, { useEffect, useMemo, useState } from 'react';
import {
  Collapse,
  Modal,
  Spin,
  message,
  Typography,
  Descriptions,
  Checkbox,
  Row,
  Col,
  Card,
  Select,
  Input,
} from 'antd';
import { aprovarMedidaIndividual } from './apiCalls/aprovarMedidaIndividual';
import { getDadosEnvolvido } from './apiCalls/getDadosEnvolvido';
import styles from './modalAprovacaoIndividual.module.scss';
import { fetchMedidas } from 'services/ducks/Mtn.ducks';
const { Option } = Select;
const { Panel } = Collapse;
const { Text, Paragraph } = Typography;

const ModalAprovacaoIndividual = ({
  idEnvolvidoAprovando,
  setIdEnvolvidoAprovando,
  onGetPareceres,
}) => {
  const [dadosEnvolvido, setDadosEnvolvido] = useState(null);
  const [loading, setLoading] = useState(false);

  const [deveAlterarMedida, setDeveAlterarMedida] = useState(false);
  const [novaMedida, setNovaMedida] = useState(null);
  const [novoParecer, setNovoParecer] = useState(null);
  const [medidas, setMedidas] = useState([]);

  useEffect(() => {
    if (deveAlterarMedida === false) {
    }
  }, [deveAlterarMedida]);

  useEffect(() => {
    if (idEnvolvidoAprovando === null) {
      setDadosEnvolvido(null);
    } else {
      setLoading(true);

      fetchMedidas()
        .then((fetchedMedidas) => {
          setMedidas(fetchedMedidas);
        })
        .catch((e) => {
          console.log(e);
          message.error('Erro ao recuperar lista de medidas');
        });

      getDadosEnvolvido(idEnvolvidoAprovando)
        .then((fetchedEnvolvido) => {
          setDadosEnvolvido(fetchedEnvolvido);
        })
        .catch((e) => {
          message.error('Erro ao recuperar dados do envolvido');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [idEnvolvidoAprovando]);

  const limparDadosAprovacao = () => {
    setIdEnvolvidoAprovando(null);
    setDeveAlterarMedida(false);
    setNovaMedida(null);
    setNovoParecer(null);
    setMedidas([]);
  };

  const onAprovarMedidaIndividual = () => {
    setLoading(true);
    aprovarMedidaIndividual({
      idEnvolvido: dadosEnvolvido.idEnvolvido,
      deveAlterarMedida,
      novaMedida,
      novoParecer,
    })
      .then(() => {
        message.success('Sucesso ao salvar parecer.');
        limparDadosAprovacao();
        onGetPareceres();
      })
      .catch((e) => {
        console.log(e);
        message.error('Erro a salvar parecer.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isDadosValidos = useMemo(() => {
    if (deveAlterarMedida && (!novaMedida || !novoParecer)) {
      return false;
    }

    return true;
  }, [deveAlterarMedida, novaMedida, novoParecer]);

  return (
    <Modal
      width={1050}
      title={`Aprovar Medida - ${idEnvolvidoAprovando}`}
      visible={idEnvolvidoAprovando !== null}
      okText={'Aprovar a medida'}
      okButtonProps={{ disabled: !isDadosValidos, loading }}
      closable={!loading}
      destroyOnClose
      onCancel={() => {
        limparDadosAprovacao();
      }}
      onOk={onAprovarMedidaIndividual}
    >
      <Spin spinning={loading}>
        <div className={styles.wrapperAprovarMedida}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Card
                title="Dados do Parecer"
                type="inner"
                extra={
                  <a
                    href={`analisar/${dadosEnvolvido?.idMtn}?idEnvolvido=${dadosEnvolvido?.idEnvolvido}`}
                    target="_blank"
                  >
                    Dados Análise
                  </a>
                }
              >
                <Paragraph>
                  <Descriptions column={2}>
                    <Descriptions.Item
                      span={2}
                      label={<Text strong>Envolvido</Text>}
                    >
                      {`${dadosEnvolvido?.matricula} - ${dadosEnvolvido?.nomeFunci}`}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Text strong>Prefixo</Text>}>
                      {`${dadosEnvolvido?.cdPrefixoAtual} - ${dadosEnvolvido?.nomePrefixoAtual}`}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<Text strong>Medida Sugerida</Text>}
                    >
                      {dadosEnvolvido?.medidaSugerdida
                        ? dadosEnvolvido?.medidaSugerdida
                        : 'Não informada'}
                    </Descriptions.Item>
                    <Descriptions.Item
                      span={2}
                      label={<Text strong>Medida Selecionada</Text>}
                    >
                      {dadosEnvolvido?.medidaSelecionada?.txtMedida}
                    </Descriptions.Item>

                    <Descriptions.Item
                      span={2}
                      label={<Text strong>Parecer</Text>}
                    >
                      {dadosEnvolvido?.txtAnalise}
                    </Descriptions.Item>
                  </Descriptions>
                </Paragraph>
              </Card>
            </Col>
            {
              Array.isArray(dadosEnvolvido?.notasInternas) && dadosEnvolvido.notasInternas.length > 0 ?
                <Col span={24}>
                  <Card title="Notas Internas" type='inner'>
                    <Collapse>
                      {dadosEnvolvido.notasInternas.map(nota => {

                        return <Panel
                          header={(
                            <Typography.Text>
                              Inserida em:
                              {' '}
                              {nota.criadoEm}
                              {' '}
                              por
                              {' '}
                              {nota.matRespAcao}
                              -
                              {nota.nomeRespAcao}
                            </Typography.Text>
                          )}
                          key={nota.id}
                        >
                          <div style={{ whiteSpace: "pre-wrap" }}>
                            {nota.descNota}
                          </div>
                        </Panel>
                      })}
                    </Collapse>
                  </Card>
                </Col>
                : null
            }

            <Col span={24}>
              <Card title="Alteração do Parecer" type="inner">
                <Row gutter={[0, 20]}>
                  <Col span={24}>
                    <Checkbox
                      onChange={(e) => {
                        setDeveAlterarMedida(e.target.checked);
                      }}
                      checked={deveAlterarMedida}
                    >
                      Deseja alterar a medida e/ou parecer?
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Select
                      disabled={deveAlterarMedida === false}
                      onChange={(selected) => {
                        console.log('selected');
                        setNovaMedida(selected);
                      }}
                      style={{ width: 250 }}
                    >
                      {medidas.map((medida) => {
                        return (
                          <Option value={medida.id}>{medida.txtMedida}</Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={24}>
                    <Input.TextArea
                      onChange={(e) => setNovoParecer(e.target.value)}
                      disabled={deveAlterarMedida === false}
                      rows={10}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </Modal>
  );
};

export default ModalAprovacaoIndividual;
