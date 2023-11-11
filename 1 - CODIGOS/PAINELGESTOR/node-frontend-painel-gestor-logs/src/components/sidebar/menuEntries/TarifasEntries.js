import React from "react";
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
import {
  DollarOutlined,
  TeamOutlined,
  FileProtectOutlined,
  SwapOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const ferramenta = "Tarifas";

function TarifasEntries(props) {
  // const isNivelGerencial = useIsNivelGerencial();
  const isNivelGerencial = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["NIVEL_GERENCIAL"],
    authState: props.authState,
  });

  const permPgtoConta = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["PGTO_CONTA", "ADMIN"],
    authState: props.authState,
  });

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="tarifas"
      title={
        <span>
          <DollarOutlined />
          <span>Tarifas</span>
        </span>
      }
    >
      <Menu.Item key="tarifas-publico-alvo">
        <Link to="/tarifas/publico-alvo">
          <span>
            <TeamOutlined />
            <span>Público Alvo</span>
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="tarifas-pendentes-pgto-especie">
        <Link to="/tarifas/pagamento-especie">
          <span>
            <FileProtectOutlined />
            <span>Pgto Espécie</span>
          </span>
        </Link>
      </Menu.Item>
      {permPgtoConta && (
        <Menu.Item key="tarifas-pagamento-conta-corrente">
          <Link to="/tarifas/pagamento-conta-corrente">
            <span>
              <SwapOutlined />
              <span>Pgto Conta</span>
            </span>
          </Link>
        </Menu.Item>
      )}

      {isNivelGerencial && (
        <Menu.Item key="gerenciar-ocorrencias">
          <Link to="/tarifas/gerenciar-ocorrencias">
            <span>
              <SettingOutlined />
              <span>Gerenciar</span>
            </span>
          </Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  );
}

export default TarifasEntries;
