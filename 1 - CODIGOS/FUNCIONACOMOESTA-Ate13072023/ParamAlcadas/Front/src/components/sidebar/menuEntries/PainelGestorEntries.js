import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePossuiAcessoPainelGestor from 'hooks/painelGestor/usePossuiAcessoPainelGestor';
import { Menu } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

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
    <Menu.Item key="painel"
      {...subMenuProps}
      title="Painel Gestor 2.0"
    >
      <Link to="/painel-gestor">
        <span>
          <DashboardOutlined />
          <span>Painel Gestão Adm</span>
        </span>
      </Link>
    </Menu.Item>
  );
}

export default PainelGestorEntries;