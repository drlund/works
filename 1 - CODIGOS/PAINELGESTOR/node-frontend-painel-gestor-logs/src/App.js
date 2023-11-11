import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale-provider/pt_BR';
import '@/App.css';
import BootstrapLoader from 'components/bootstraploader/BootstrapLoader';
import MainLayout from 'layouts/WebLayout';
import AppConfig from 'config/app.config';
import Authentication from 'components/authentication/Authentication';

class App extends Component {
  constructor() {
    super();
    this.state = {
      appStarted: false
    };
  }

  startApp = () => {
    setTimeout(() => this.setState({ appStarted: true }), 1000);
  };

  render() {
    const { appStarted } = this.state;
    if (!appStarted && AppConfig.showBTLoader) {
      this.startApp();
      return <BootstrapLoader />;
    }

    return (
      <ConfigProvider locale={ptBR}>
        <>
          <Authentication />
          <MainLayout />
        </>
      </ConfigProvider>
    );
  }
}

export default App;
