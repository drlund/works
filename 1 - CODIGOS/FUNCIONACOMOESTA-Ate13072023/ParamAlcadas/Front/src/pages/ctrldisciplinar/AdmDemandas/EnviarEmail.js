import React, { Component } from 'react';
import { connect } from 'react-redux';
import { enviarCobrancaGedip } from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
import { Row, Col, Button, message } from 'antd';
import PageLoading from '../../../components/pageloading/PageLoading';

// import { Container } from './styles';

export class EnviarEmail extends Component {
  state = {
    sending: false
  }

  enviarCobrancaGedip = () => {
    this.setState({ sending: true }, () => {
      this.props.enviarCobrancaGedip({
        id_gedip: this.props.registro.id_gedip,
        responseHandler: {
          successCallback: () => {
            this.setState({sending: false});
            message.success('O email foi enviado com sucesso!!');
            setTimeout(() => {
              this.props.dismissModal();
            }, 800);
          },
          errorCallback: () => {
            this.setState({ sending: false });
            message.error('O email NÃO foi enviado. Favor refazer a operação!!');
          }
        }
      })
    });
  }

  render() {
    if (this.state.sending) {
      return <PageLoading />;
    }
    return (
      <React.Fragment>
        <Row>
          <Col span={8}>
          </Col>
          <Col span={8}>
            <Row>
              <Button type="primary" onClick={this.enviarCobrancaGedip}>Clique para enviar e-mail de cobrança</Button>
            </Row>
          </Col>
          <Col span={8}>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(null, { enviarCobrancaGedip })(EnviarEmail);
