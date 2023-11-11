import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Image,
  List,
  Pagination,
  Row,
  Space,
  message
} from 'antd';
import React from 'react';

import { useSpinning } from 'components/SpinningContext';
import { MinutaTemplateShowData } from 'pages/procuracoes/innerComponents/MinutaTemplate';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import { getProfileURL } from 'utils/Commons';

import DadosOutorgado from '../Displays/DadosOutorgado';
import { useMinutaMassificado } from '../EtapaMinutaMassificado/useMinutaMassificado';
import { FinalizarItemWrapper } from './FinalizarItemWrapper';
import { FlexTitleWithEditButton } from './FlexTitleWithEditButton';
import { OutorganteFinalizarDisplay } from './OutorganteFinalizarDisplay';

/**
 * @param {Procuracoes.CurrentStepParameters<Procuracoes.DadosProcuracao>} props
 */
export const EtapaFinalizarMassificadoMinuta = ({
  dadosEtapa, subtrairStep, adicionarStep, goToStep
}) => {
  const { setLoading } = useSpinning();

  const onCadastrarMinutas = async () => {
    setLoading(true);
    await fetch(
      FETCH_METHODS.POST,
      'procuracoes/massificado/minuta/finalizar',
      dadosEtapa,
      { 'Content-Type': 'application/json' },
    ).then((result) => {
      message.success('Lote de minutas cadastrado com sucesso');
      adicionarStep(result);
    }).catch((error) => {
      if (typeof error === 'string') {
        message.error(error);
      }
      message.error('Erro ao cadastrar o lote de minutas.');
    }).finally(() => {
      setLoading(false);
    });
  };

  const {
    listaDeErros,
    listaDeMatriculas,
    currentDadosProcuracao,
    currentMatricula,
    current,
    setCurrent,
  } = useMinutaMassificado();

  /** @param {{ nome: string }} props */
  const maybeNome = ({ nome }) => (nome) ? ` - ${nome}` : '';

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Card
          type="inner"
          title={(
            <FlexTitleWithEditButton
              heading="Outorgante"
              editButtonFn={() => goToStep('poderes')}
            />
          )}
        >
          <OutorganteFinalizarDisplay
            poderes={dadosEtapa.poderes}
          />
        </Card>
      </Col>

      {
        listaDeErros.length > 0 && (
          <Col span={24}>
            <Card
              type="inner"
              title={(
                <FlexTitleWithEditButton
                  heading="Outorgados ignorados (com erros)"
                  editButtonFn={() => goToStep('outorgadoMassificado')}
                />
              )}
            >
              <List
                itemLayout="horizontal"
                dataSource={listaDeErros}
                rowKey='matricula'
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={getProfileURL(item.matricula)} alt={item.nome || `Funci ${item.matricula}`} />
                      }
                      title={
                        <span style={{ color: 'red' }}>
                          {`${item.matricula.toUpperCase()}${maybeNome(/** @type {Procuracoes.FunciError & {nome: string}} */(item))}`}
                        </span>
                      }
                      description={<span style={{ color: 'red' }}>{item.error}</span>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )
      }

      {/* TODO: lista de outorgados OK para quick view */}

      <Col span={24}>
        <Card
          type="inner"
          title={(
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <h3>Outorgados & Minutas</h3>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
                <Button onClick={() => goToStep('outorgadoMassificado')}>Editar Outorgado</Button>
                <Button onClick={() => goToStep('dadosMinuta')}>Editar Minuta</Button>
              </div>
            </div>
          )}
        >
          <Pagination
            total={listaDeMatriculas.length}
            defaultPageSize={1}
            current={current}
            showSizeChanger={false}
            showQuickJumper
            responsive
            onChange={setCurrent}
            style={{ marginBottom: '1em' }}
          />

          <MinutaTemplateShowData
            cardTitle={
              <div style={{ fontWeight: 'unset' }}>
                <FinalizarItemWrapper
                  icon={(
                    <Avatar
                      src={<Image src={`https://humanograma.intranet.bb.com.br/avatar/${currentMatricula}`} />}
                      style={{ height: '4em', width: '4em' }}
                      icon={<UserOutlined style={{ fontSize: '5em' }} />}
                    />
                  )}
                  text={`${currentMatricula.toUpperCase()} - ${currentDadosProcuracao.outorgado.nome}`}
                  detalhesAppend="do Outorgado"
                >
                  <DadosOutorgado
                    outorgado={/** @type {Funci} */(currentDadosProcuracao.outorgado)}
                  />
                </FinalizarItemWrapper>
              </div>
            }
            templateBase={dadosEtapa.dadosMinuta.templateBase}
            dadosProcuracao={currentDadosProcuracao}
          />
        </Card>
      </Col>

      <Col span={24}>
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          {subtrairStep && (
            <Button type="default" onClick={subtrairStep}>
              Anterior
            </Button>
          )}

          {adicionarStep && (
            <Button
              type="primary"
              disabled={dadosEtapa === null}
              onClick={onCadastrarMinutas}
              style={{ zIndex: 100 }}
            >
              Registrar Lote de Minutas
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};
