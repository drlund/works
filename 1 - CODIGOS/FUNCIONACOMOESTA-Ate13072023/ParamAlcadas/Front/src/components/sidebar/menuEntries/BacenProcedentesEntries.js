import React from 'react'
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
import {
  BankOutlined
} from "@ant-design/icons";

const ferramenta = "Bacen Procedentes";

function BacenProcedentes(props) {
  const permBacenProc = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["USUARIO"],
    authState: props.authState,
  });

  if (!permBacenProc) {
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
      key="bacenproc"
      title={
        <span>
          <BankOutlined />
          <span>Bacen Procedentes</span>
        </span>
      }
    >
      <Menu.Item key="bacen-acomp">
        <Link to="/bacenproc/Acompanhamento">Acompanhamento</Link>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default BacenProcedentes
