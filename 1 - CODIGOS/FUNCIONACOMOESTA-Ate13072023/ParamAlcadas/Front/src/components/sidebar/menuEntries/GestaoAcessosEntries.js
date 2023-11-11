import React from 'react'
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
import {
  SettingOutlined
} from "@ant-design/icons";

const ferramenta = "Gestão de Acessos";

function GestaoAcessosEntries(props) {
  const permGestaoAcesso = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["GESTOR_ACESSOS"],
    authState: props.authState
  });

  if (!permGestaoAcesso) {
    return null;
  }

  const subMenuProps = {...props};
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.SubMenu
    {...subMenuProps}
      key="administracao"
      title={
        <span>
          <SettingOutlined />
          <span>Gestão de Acessos</span>
        </span>
      }
    >
      <Menu.Item key="acessos-1">
        <Link to="/app/administrar/acessos">Acessos</Link>
      </Menu.Item>
      <Menu.Item key="acessos-permissoes">
        <Link to="/app/administrar/permissoes">
          Perm. das Ferramentas
        </Link>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default GestaoAcessosEntries
