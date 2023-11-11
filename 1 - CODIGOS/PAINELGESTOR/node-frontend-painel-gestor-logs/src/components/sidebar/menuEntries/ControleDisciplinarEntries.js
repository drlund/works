import React from 'react'
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
import {
  AuditOutlined
} from "@ant-design/icons";

const ferramenta = "Controle Disciplinar";

function ControleDisciplinarEntries(props) {
  const ctrlDisciplinar = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["VISUALIZAR", "ATUALIZAR"],
    authState: props.authState,
  });

  const ctrlDisciplinarVisualizar = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["VISUALIZAR"],
    authState: props.authState,
  });

  const ctrlDisciplinarAtualizar = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["ATUALIZAR"],
    authState: props.authState,
  });

  if (!ctrlDisciplinar) {
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
      key="ctrlDiscipl"
      title={
        <span>
          <AuditOutlined />
          <span>Controle Disciplinar</span>
        </span>
      }
    >
      {ctrlDisciplinarVisualizar && (
        <Menu.Item key="ctrl-gedip">
          <Link to="/ctrldisciplinar/Demandas">
            Demandas GEDIP
          </Link>
        </Menu.Item>
      )}

      {ctrlDisciplinarAtualizar && (
        <Menu.Item key="ctrl-admin">
          <Link to="/ctrldisciplinar/GerDemandas">
            Demandas GEDIP :: Administrador
          </Link>
        </Menu.Item>
      )}

      {ctrlDisciplinarAtualizar && (
        <Menu.Item key="ctrl-hist">
          <Link to="/ctrldisciplinar/HistDemandas">
            Históricos GEDIP
          </Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  )
}

export default ControleDisciplinarEntries
