import React from 'react'
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
import Icon from "@ant-design/icons";
import BrazilFlag from "../BrazilFlag";

const ferramenta = "Autoridades Secex";

function AutoridadesSecex(props) {
  const permAutSecex = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["USUARIO"],
    authState: props.authState,
  });

  if (!permAutSecex) {
    return null
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
      key="autoridades-secex"
      title={
        <span>
          <Icon component={BrazilFlag} />
          <span>Autoridades Secex</span>
        </span>
      }
    >
      <Menu.Item key="aut-dados">
        <Link to="/autoridades/dados-autoridades">
          Dados de Autoridades
        </Link>
      </Menu.Item>
      <Menu.Item key="aut-publico-alvo">
        <Link to="/autoridades/publico-alvo">Público Alvo</Link>
      </Menu.Item>
      <Menu.Item key="aut-cons-aniversarios">
        <Link to="/autoridades/consulta-aniversarios">Consulta Aniversariantes</Link>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default AutoridadesSecex
