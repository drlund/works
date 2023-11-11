import React, { PureComponent } from 'react';
import {
  Button,
  Steps,
  Card,
  Typography,
  message
} from 'antd';
import uuid from 'uuid/v4';

import { getPrefSubord } from 'services/ducks/Designacao.ducks';

import StyledCard from 'components/styledcard/StyledCard';
import StyledCardPrimary from 'components/styledcard/StyledCardPrimary';

import FrameFunci from 'pages/designacao/Solicitacao/ValidarFunci';
import Confirmacao from 'pages/designacao/Solicitacao/Confirmacao';
import FrameVaga from 'pages/designacao/Solicitacao/ValidarVaga';

const { Step } = Steps;
const { Text } = Typography;

class Validacao extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      prefixos: [],
      keyFunci: uuid(),
      keyVaga: uuid(),
      stepsRendered: []
    };

    this._isMounted = true;
  }

  componentDidMount() {
    getPrefSubord()
      .then((prefixos) => this._isMounted && this.setState({ prefixos }, () => this.renderSteps()))
      .catch((err) => message.error(err));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  steps = () => {
    const { keyFunci, keyVaga, prefixos } = this.state;
    const { tipo, protocolo } = this.props;
    return [
      {
        title: 'Validar Vaga',
        content: <FrameVaga key={keyVaga} protocolo={protocolo || ''} tipo={tipo} defaultOptions={prefixos} next={this.next} />
      },
      {
        title: 'Validar Funci',
        content: <FrameFunci key={keyFunci} protocolo={protocolo || ''} tipo={tipo} next={this.next} />
      },
      {
        title: 'Confirmação',
        content: <Confirmacao tipo={tipo} protocolo={protocolo || ''} confirmar={this.confirmar} />
      }
    ];
  };

  next = () => {
    const { current } = this.state;
    this.setState({ current: current + 1 });
  };

  prev = () => {
    const { current } = this.state;
    this.setState({ current: current - 1 });
  };

  confirmar = (values) => {
    const { confirmar: thisConfirmar } = this.props;
    thisConfirmar(values);
  };

  renew = (aba) => {
    if (!aba) this.setState({ keyFunci: uuid(), keyVaga: uuid() }, () => true);
    this.setState({ keyFunci: uuid() }, () => true);
  };

  renderSteps = () => {
    const steps = this.steps().map((elem) => (
      <Step key={elem.title} title={elem.title} />
    ));

    this.setState({ stepsRendered: steps }, () => true);
  };

  render() {
    const steps = this.steps();
    const { current, stepsRendered } = this.state;
    const { protocolo, tipo } = this.props;

    return (
      <StyledCardPrimary title={tipo.nome}>
        {protocolo && (
          <Card>
            <Text>Formando cadeia de protocolos com o protocolo </Text>
            <Text strong>{protocolo}</Text>
          </Card>
        )}
        <StyledCard>
          <Steps current={current}>
            {stepsRendered}
          </Steps>
          <div className="steps-content" style={{ marginTop: 20 }}>{steps[current].content}</div>
        </StyledCard>
        <div className="steps-action">
          {current > 0 && (
            <Button style={{ margin: 8 }} onClick={() => this.prev()}>
              Anterior
            </Button>
          )}
          {
            current < 2 && (
              <Button style={{ margin: 8 }} onClick={() => this.renew(current)}>Limpar</Button>
            )
          }
        </div>
      </StyledCardPrimary>
    );
  }
}

export default React.memo(Validacao);
