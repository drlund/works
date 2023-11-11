import React from 'react'
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  ContainerOutlined
} from "@ant-design/icons";

function OrdemServicoEntries(props) {
  const subMenuProps = {...props};
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.SubMenu
    {...subMenuProps}
      key="ordemserv"
      title={
        <span>
          <ContainerOutlined />
          <span>Ordem de Serviço</span>
        </span>
      }
    >
      <Menu.Item key="os-minhas-ordens">
        <Link to="/ordemserv/minhas-ordens">Minhas Ordens</Link>
      </Menu.Item>
      <Menu.Item key="os-nova-ordem">
        <Link to="/ordemserv/nova-ordem">Nova Ordem</Link>
      </Menu.Item>
      <Menu.Item key="os-sugestoes">
        <Link to="/ordemserv/ordens-analisadas">
          Lista de Sugestões
        </Link>
      </Menu.Item>

      <Menu.Item key="1115">
        <a
          href="https://portaldarede.intranet.bb.com.br/r1115"
          target="_blank"
          rel="noopener noreferrer"
        >
          Relatório Acomp. - 1115
        </a>
      </Menu.Item>

      <Menu.Item key="os-tutorial">
        <a
          href={`${process.env.REACT_APP_ENDPOINT_API_URL}/uploads/ordemserv/video_ordem_servico.webm`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tutorial em Vídeo
        </a>
      </Menu.Item>

      <Menu.Item key="os-manual">
        <a
          href="https://super.intranet.bb.com.br/app/wiki/doku.php?id=manuais:m_ordem_servico"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manual do Usuário
        </a>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default OrdemServicoEntries
