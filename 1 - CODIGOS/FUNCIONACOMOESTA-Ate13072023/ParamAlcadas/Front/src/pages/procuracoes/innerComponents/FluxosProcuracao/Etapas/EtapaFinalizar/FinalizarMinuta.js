import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Image,
  message,
  Row,
  Space
} from 'antd';
import React from 'react';

import { useSpinning } from 'components/SpinningContext';
import { MinutaTemplateShowData } from 'pages/procuracoes/innerComponents/MinutaTemplate';
import { fetch, FETCH_METHODS } from 'services/apis/GenericFetch';

import DadosOutorgado from '../Displays/DadosOutorgado';
import { FinalizarItemWrapper } from './FinalizarItemWrapper';
import { FinalizarMinutaModal } from './FinalizarMinutaModal';
import { FlexTitleWithEditButton } from './FlexTitleWithEditButton';
import { OutorganteFinalizarDisplay } from './OutorganteFinalizarDisplay';

/**
 * @param {Procuracoes.CurrentStepParameters<Procuracoes.DadosProcuracao>} props
 */
const EtapaFinalizarMinuta = ({
  dadosEtapa, subtrairStep, adicionarStep, goToStep
}) => {
  const { setLoading } = useSpinning();

  const onCadastrarMinutas = async () => {
    setLoading(true);
    await fetch(
      FETCH_METHODS.POST,
      'procuracoes/minutas',
      dadosEtapa,
      { 'Content-Type': 'application/json' },
    ).then((result) => {
      message.success('Minuta cadastrada com sucesso');
      adicionarStep(result);
    }).catch((error) => {
      if (typeof error === 'string') {
        message.error(error);
      }
      message.error('Erro ao cadastrar a minuta.');
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Row gutter={[0, 20]}>
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

      <Col span={24}>
        <Card
          type="inner"
          title={(
            <FlexTitleWithEditButton
              heading="Minuta"
              editButtonFn={() => goToStep('dadosMinuta')}
            />
          )}
        >
          <MinutaTemplateShowData
            dadosProcuracao={dadosEtapa}
            templateBase={dadosEtapa.dadosMinuta.template}
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

          <FinalizarMinutaModal
            buttonDisabled={dadosEtapa === null}
            cb={onCadastrarMinutas}
          />
        </Space>
      </Col>
    </Row>
  );
};

export default EtapaFinalizarMinuta;
