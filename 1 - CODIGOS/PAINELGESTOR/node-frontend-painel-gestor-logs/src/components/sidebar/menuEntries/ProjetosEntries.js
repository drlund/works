import React from "react";
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
import { RocketOutlined } from "@ant-design/icons";

const ferramenta = "Projetos";

function ProjetosEntries(props) {
  const permissaoUsuario = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["USUARIO", "ADM"],
    authState: props.authState,
  });

  const permissaoAcompanhamento = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["ACPTOTAL", "ACPGERAD", "ACPANDAMENTO"],
    authState: props.authState,
  });

  const permissaoDev = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['DEV'],
    authState: props.authState,
  })

  if (!permissaoUsuario) {
    return null;
  }

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="projetos"
      title={
        <span>
          <RocketOutlined />
          <span>Projeta.Aí</span>
        </span>
      }
    >
      <Menu.Item key="projetos-lista-pedidos">
        <Link to="/projetos/lista-projetos">Pedidos</Link>
      </Menu.Item>
      { permissaoAcompanhamento &&
      <Menu.Item key="projetos-acompanhamento">
        <Link to="/projetos/acompanhamento">Acompanhamento</Link>
      </Menu.Item>
      }
      { permissaoDev &&
      <Menu.Item key='central-atividade'>
        <Link to="/projetos/central-atividades">Central Atividades</Link>
      </Menu.Item>
      }
    </Menu.SubMenu>
  );
}

export default ProjetosEntries;
