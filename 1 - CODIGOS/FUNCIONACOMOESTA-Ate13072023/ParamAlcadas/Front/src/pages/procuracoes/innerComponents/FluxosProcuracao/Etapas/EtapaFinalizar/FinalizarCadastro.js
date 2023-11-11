import {
  AuditOutlined, BankOutlined, FileTextOutlined, UserOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button, Card, Col, Image, message, Row, Space
} from 'antd';
import React from 'react';

import { useSpinning } from 'components/SpinningContext';
import { useHistoryPushWithQuery } from 'hooks/useHistoryPushWithQuery';

import DadosProcuracao from '../DadosProcuracao/Display';
import DadosCartorio from '../Displays/DadosCartorio';
import DadosOutorgado from '../Displays/DadosOutorgado';
import DadosSubsidiaria from '../Displays/DadosSubsidiaria';
import { cadastrarProcuracaoSuperAdm } from './apiCalls/cadastrarProcuracao';
import { FinalizarItemWrapper } from './FinalizarItemWrapper';
import { FlexTitleWithEditButton } from './FlexTitleWithEditButton';
import { OutorganteFinalizarDisplay } from './OutorganteFinalizarDisplay';

/**
 * @param {Procuracoes.CurrentStepParameters<Procuracoes.DadosProcuracao>} props
 */
const EtapaFinalizarCadastro = ({ dadosEtapa, subtrairStep, goToStep }) => {
  const { setLoading } = useSpinning();
  const historyPush = useHistoryPushWithQuery();

  const onCadastrarProcuracao = () => {
    setLoading(true);
    cadastrarProcuracaoSuperAdm(dadosEtapa)
      .then(() => {
        message.success('Procuração cadastrada com sucesso');
        historyPush('/procuracoes/');
      })
      .catch((error) => {
        if (typeof error === 'string') {
          message.error(error);
        }
        message.error('Erro ao cadastrar a procuração.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Row gutter={[0, 20]}>
      {
        dadosEtapa.cartorio ? (
          <Col span={24}>
            <Card
              type="inner"
              title={(
                <FlexTitleWithEditButton
                  heading="Cartório"
                  editButtonFn={() => goToStep('cartorio')}
                />
              )}
            >
              <FinalizarItemWrapper
                icon={(
                  <AuditOutlined
                    style={{ fontSize: '5em' }}
                  />
                )}
                text={dadosEtapa.cartorio.nome}
                detalhesAppend="do Cartório"
              >
                <DadosCartorio cartorio={dadosEtapa.cartorio} />
              </FinalizarItemWrapper>
            </Card>
          </Col>
        ) : null
      }

      {
        dadosEtapa.dadosProcuracao ? (
          <Col span={24}>
            <Card
              type="inner"
              title={(
                <FlexTitleWithEditButton
                  heading="Dados da Procuração"
                  editButtonFn={() => goToStep('dadosProcuracao')}
                />
              )}
            >
              <FinalizarItemWrapper
                icon={(
                  <FileTextOutlined
                    style={{ fontSize: '5em' }}
                  />
                )}
                text="Procuração"
                detalhesAppend="da Procuração"
              >
                <DadosProcuracao dadosProcuracao={dadosEtapa.dadosProcuracao} />
              </FinalizarItemWrapper>
            </Card>
          </Col>
        ) : null
      }

      {
        dadosEtapa.outorgado ? (
          <Col span={24}>
            <Card
              type="inner"
              title={(
                <FlexTitleWithEditButton
                  heading="Outorgado"
                  editButtonFn={() => goToStep('outorgado')}
                />
              )}
            >
              <FinalizarItemWrapper
                icon={(
                  <Avatar
                    src={<Image src={`https://humanograma.intranet.bb.com.br/avatar/${dadosEtapa.outorgado.matricula}`} />}
                    style={{ height: '4em', width: '4em' }}
                    icon={<UserOutlined style={{ fontSize: '5em' }} />}
                  />
                )}
                text={`${dadosEtapa.outorgado.matricula} - ${dadosEtapa.outorgado.nome}`}
                detalhesAppend="do Outorgado"
              >
                <DadosOutorgado
                  outorgado={dadosEtapa.outorgado}
                />
              </FinalizarItemWrapper>
            </Card>
          </Col>
        ) : null
      }

      {
        dadosEtapa.poderes ? (
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
        ) : null
      }

      {
        dadosEtapa.subsidiaria ? (
          <Col span={24}>
            <Card
              type="inner"
              title={(
                <FlexTitleWithEditButton
                  heading="Dados da Subsidiária"
                  editButtonFn={() => goToStep('subsidiaria')}
                />
              )}
            >
              <FinalizarItemWrapper
                icon={(
                  <BankOutlined
                    style={{ fontSize: '5em' }}
                  />
                )}
                text={dadosEtapa.subsidiaria.nome}
                detalhesAppend="da Subsidiária"
              >
                <DadosSubsidiaria subsidiaria={dadosEtapa.subsidiaria} />
              </FinalizarItemWrapper>
            </Card>
          </Col>
        ) : null
      }

      <Col span={24}>
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          {subtrairStep && (
            <Button type="default" onClick={subtrairStep}>
              Anterior
            </Button>
          )}

          <Button
            type="primary"
            disabled={dadosEtapa === null}
            onClick={onCadastrarProcuracao}
            style={{ zIndex: 100 }}
          >
            Registrar Cadastro
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default EtapaFinalizarCadastro;
