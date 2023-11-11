import React from "react";
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
import { LikeOutlined } from "@ant-design/icons";

const ferramenta = "Elogios";

function ElogiosEntries(props) {
  const permElogios = verifyPermission({
    ferramenta,
    permissoesRequeridas: [
      "REGISTRAR_ELOGIO",
      "AUTORIZAR_ENVIO",
      "VER_HISTORICO_ODI",
    ],
    authState: props.authState,
  });

  const permElogiosHistODI = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["VER_HISTORICO_ODI"],
    authState: props.authState,
  });

  if (!permElogios) {
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
      key="elogios"
      title={
        <span>
          <LikeOutlined />
          <span>Elogios</span>
        </span>
      }
    >
      <Menu.Item key="elogios-registrar">
        <Link to="/elogios/registrar-elogio">Registrar Elogio</Link>
      </Menu.Item>
      <Menu.Item key="elogios-lista">
        <Link to="/elogios/lista-elogios">Lista de Elogios</Link>
      </Menu.Item>
      <Menu.Item key="elogios-historico">
        <Link to="/elogios/historico-elogios">Histórico de Elogios</Link>
      </Menu.Item>

      {permElogiosHistODI && (
        <Menu.Item key="elogios-odi">
          <Link to="/elogios/historico-odi">Histórico de ODI's</Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  );
}

export default ElogiosEntries;
