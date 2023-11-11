import React from 'react';
import Logo from './login.svg';
import { LogIn } from 'components/authentication/Authentication';
import { Button } from 'antd'

export default function NotAuthenticated() {
  return (
    <div style={{display: 'flex', alignContent: 'center', flexGrow: 'inherit', alignItems: 'center', height: '88vh'}}>
      <div style={{ flex: 1, textAlign: 'center'}}>
        <h1 className="info-message">Faça Login para Acessar esta Página</h1>
        <Button type="primary" size="large" onClick={() => LogIn()}>Login</Button>
      </div>
      <div style={{ flex: 1, textAlign: 'center'}}>
        <img src={Logo} alt="logo usuario nao autenticado" style={{flex: 1, width: '40%'}} />
      </div>
    </div>
  )
}