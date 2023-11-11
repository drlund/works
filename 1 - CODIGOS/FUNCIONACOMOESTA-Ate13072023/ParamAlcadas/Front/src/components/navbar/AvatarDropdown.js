import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KeyOutlined, MailOutlined, TeamOutlined, UserDeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Avatar } from 'antd';
import { LogIn, LogOut } from 'components/authentication/Authentication';
import { getProfileURL } from 'utils/Commons';
import { reloadUserPermissions } from 'services/actions/commons';

const MenuList = (props) => {
  return (
    <Menu>      
      <Menu.Item key="0" disabled>
        {props.nomeGuerra}
      </Menu.Item>
      <Menu.Divider />

      { !props.isLoggedIn && 
        <Menu.Item key="1" onClick={() => LogIn()}>
          <UserOutlined /> Login
        </Menu.Item>
      } 

      { props.isLoggedIn && 
        <Menu.Item key="1" onClick={() => LogOut()}>
          <UserDeleteOutlined /> Logoff
        </Menu.Item>
      } 

      { props.isLoggedIn && 
        <Menu.Item key="1.1" onClick={() => props.reloadUserPermissions()}>
          <KeyOutlined /> Recarregar Acessos
        </Menu.Item>
      } 

      <Menu.Item key="2">
        <a target="_blank" rel="noopener noreferrer" href="https://correioweb.bb.com.br">
          <MailOutlined /> Correio Web
        </a>
      </Menu.Item>

      <Menu.Item key="3">
        <a target="_blank" rel="noopener noreferrer" href="https://humanograma.intranet.bb.com.br">
          <TeamOutlined /> Humanograma
        </a>
      </Menu.Item>
    </Menu>
  );
};

class AvatarDropdown extends Component {
  getAvatarComp = authState => {
    if (authState.isLoggedIn) {
      return <Avatar 
                style={{cursor: 'pointer'}}
                src={getProfileURL(authState.sessionData.chave)}
             />
    }

    return <Avatar style={{cursor: 'pointer'}}>NL</Avatar>;
  }

  render() {
    let authState = this.props.authState;
    const menuProps = {
      isLoggedIn: authState.isLoggedIn,
      nomeGuerra: authState.isLoggedIn ? authState.sessionData.nome_guerra : 'Não Logado',
      reloadUserPermissions: this.props.reloadUserPermissions
    };

    return (
      <div>        
        <Dropdown overlay={() => MenuList(menuProps) } placement="bottomRight">
          {this.getAvatarComp(authState)}
        </Dropdown>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { authState : { ...state.app.authState }}
}

export default connect(mapStateToProps, { reloadUserPermissions })(AvatarDropdown);
