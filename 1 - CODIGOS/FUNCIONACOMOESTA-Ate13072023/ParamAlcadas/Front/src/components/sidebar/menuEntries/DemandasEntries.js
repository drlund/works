import React from 'react'
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
import {
  SettingOutlined,
  SolutionOutlined
} from "@ant-design/icons";

const ferramenta = "Demandas";

function DemandasEntries(props) {
  const permGestaoDemandas = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["GERENCIAR_DEMANDAS"],
    authState: props.authState
  });

  const subMenuProps = {...props};
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="demandas"
      title={
        <span>
          <SolutionOutlined />
          <span>Demandas</span>
        </span>
      }
    >
      <Menu.Item key="dem-minhas-demandas">
        <Link to="/demandas/minhas-demandas">Minhas Demandas</Link>
      </Menu.Item>
      {permGestaoDemandas && (
        <Menu.SubMenu        
          key="dem-admin"
          title={
            <span>
              <SettingOutlined />
              <span>Administrar</span>
            </span>
          }
        >
          <Menu.Item key="dem-nova-demanda">
            <Link to="/demandas/nova-demanda">Nova Demanda</Link>
          </Menu.Item>
          <Menu.Item key="dem-admin-demandas">
            <Link to="/demandas/minhas-demandas-adm">
              Administrar Demandas
            </Link>
          </Menu.Item>

          <Menu.Item key="dem-manual">
            <a
              href="https://super.intranet.bb.com.br/app/wiki/doku.php?id=manuais:demandas2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manual do Usuário
            </a>
          </Menu.Item>
        </Menu.SubMenu>
      )}
    </Menu.SubMenu>
  )
}

export default DemandasEntries
