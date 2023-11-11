/* eslint-disable react/destructuring-assignment */
import {
  Button,
  Divider,
  Modal,
  Typography,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ModalAuth.css';

const { Title } = Typography;

class ModalAuth extends Component {
  constructor(props) {
    super(props);
    this.intervId = null;
    this.state = {
      modalVisible: false,
      waitingVerify: true
    };
  }

  componentDidMount() {
    this.waitVerifyLogin();
  }

  componentWillUnmount() {
    clearTimeout(this.intervId);
  }

  openPopup = () => {
    window.bbapi.logIn(true);
  };

  waitVerifyLogin = () => {
    this.intervId = setTimeout(() => {
      this.setState({ waitingVerify: false });
    }, 2500);
  };

  render() {
    if (!process.env.REACT_APP_AUTHENTICATION_URL) {
      return null;
    }

    let { modalVisible } = this.state;

    if (!modalVisible && !this.props.isLoggedIn) {
      modalVisible = this.props.visible;
    }

    if (this.state.waitingVerify) {
      return (
        <Modal
          visible={modalVisible}
          title=""
          centered
          closable={false}
          maskClosable={false}
          footer={false}
          width={575}
          bodyStyle={{
            padding: '15px',
            height: 430,
            paddingRight: '15px',
            paddingTop: '28px'
          }}
        >

          <div style={{ width: '100%', textAlign: 'center' }}>
            <Divider>
              <Title level={4}>Verificando sua Autenticação...</Title>
            </Divider>
          </div>

          <div style={{ width: '100%', textAlign: 'center' }}>
            <img src={`${process.env.PUBLIC_URL}/assets/images/waitng_authentication.gif`} width="390" height="292" alt="img autenticacao" />
          </div>

        </Modal>
      );
    }
    if (window.bbapi.isLoggedIn()) {
      // se ja estiver logado nao precisa exibir.
      return null;
    }

    return (
      <Modal
        visible={modalVisible}
        title=""
        centered
        closable={false}
        maskClosable={false}
        footer={[
          <Button key="submit" type="primary" onClick={this.openPopup}>
            Fazer Login
          </Button>,
        ]}
        width={575}
        bodyStyle={{
          padding: '15px',
          height: 410,
          paddingRight: '15px',
          paddingTop: '28px'
        }}
        >

        <div style={{ width: '100%', textAlign: 'center' }}>
          <Divider>
            <Title level={4}>Você não está autenticado!</Title>
          </Divider>
        </div>

        <div style={{ width: '100%', textAlign: 'center' }}>
          <img src={`${process.env.PUBLIC_URL}/assets/images/authentication.png`} width="390" height="292" alt="img autenticacao" />
        </div>

      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({ isLoggedIn: state.app.authState.isLoggedIn });

export default connect(mapStateToProps, null)(ModalAuth);
