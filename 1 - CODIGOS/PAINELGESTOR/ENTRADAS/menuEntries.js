/**
 * Agora, quando o usuário clicar no item "Painel Gestor 2.0", ele abrirá o submenu com os subitens "Painel Gestão Adm", "Adicionar App" e "Adicionar Usuário". 
 * Certifique-se de importar os ícones relevantes do Ant Design, conforme mostrado no exemplo acima.
 * 
 * Para adicionar dois subitens (Menu.Items) diretamente ao Menu.Item existente quando o usuário clicar no item, você pode usar o componente SubMenu do Ant 
 * Design para criar um submenu. Aqui está uma versão modificada do seu código com dois subitens adicionados:
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePossuiAcessoPainelGestor from 'hooks/painelGestor/usePossuiAcessoPainelGestor';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { DashboardOutlined, AppstoreAddOutlined, UserAddOutlined } from '@ant-design/icons';

function PainelGestorEntries(props) {
  const possuiAcessoPainelGestor = usePossuiAcessoPainelGestor();

  if (!possuiAcessoPainelGestor) {
    return null;
  }

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <SubMenu key="painel"
      {...subMenuProps}
      title="Painel Gestor 2.0"
    >
      <Menu.Item key="dashboard">
        <Link to="/painel-gestor">
          <span>
            <DashboardOutlined />
            <span>Painel Gestão Adm</span>
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="adicionar-app">
        <Link to="/adicionar-app">
          <span>
            <AppstoreAddOutlined />
            <span>Adicionar App</span>
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="adicionar-usuario">
        <Link to="/adicionar-usuario">
          <span>
            <UserAddOutlined />
            <span>Adicionar Usuário</span>
          </span>
        </Link>
      </Menu.Item>
    </SubMenu>
  );
}

export default PainelGestorEntries;
