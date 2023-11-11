import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import {
  AuditOutlined,
  CloseOutlined,
  ContainerOutlined,
  DiffOutlined,
  EditOutlined,
  ExportOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons';
import history from 'history.js';
import constantes from 'pages/flexCriterios/helpers/constantes';

const buttonCustomizado = {
  type: 'secondary',
  shape: 'square',
};

// eslint-disable-next-line no-undef
export default function ConsultaAcoes({
  idPedidoFlex,
  etapa,
  perfil,
  setIdAvocarSelecionado,
  setIdEncerrarSelecionado,
}) {
  const detalhar = (
    <Tooltip title="Detalhar">
      <Button
        {...buttonCustomizado}
        icon={<SearchOutlined />}
        onClick={() => history.push(`/flex-criterios/resumo/${idPedidoFlex}`)}
      />
    </Tooltip>
  );
  const manifestacao = (
    <Tooltip title="Escrever Manifestação">
      <Button
        {...buttonCustomizado}
        icon={<EditOutlined />}
        onClick={() =>
          history.push(`/flex-criterios/manifestar/${idPedidoFlex}`)
        }
      />
    </Tooltip>
  );
  const analise = (
    <Tooltip title="Realizar a análise do pedido">
      <Button
        {...buttonCustomizado}
        icon={<DiffOutlined />}
        onClick={() =>
          history.push(`/flex-criterios/manifestar/${idPedidoFlex}`)
        }
      />
    </Tooltip>
  );
  const despacho = (
    <Tooltip title="Realizar o despacho do pedido">
      <Button
        {...buttonCustomizado}
        icon={<ContainerOutlined />}
        onClick={() =>
          history.push(`/flex-criterios/manifestar/${idPedidoFlex}`)
        }
      />
    </Tooltip>
  );
  const encerrar = (
    <Tooltip title="Encerrar">
      <Button
        {...buttonCustomizado}
        icon={<CloseOutlined />}
        onClick={() => setIdEncerrarSelecionado(idPedidoFlex)}
      />
    </Tooltip>
  );
  const deferir = (
    <Tooltip title="Deferir">
      <Button
        {...buttonCustomizado}
        icon={<SendOutlined />}
        onClick={() =>
          history.push(`/flex-criterios/manifestar/${idPedidoFlex}`)
        }
      />
    </Tooltip>
  );
  const avocar = (
    <Tooltip title="Avocar">
      <Button
        {...buttonCustomizado}
        icon={<ExportOutlined />}
        onClick={() => setIdAvocarSelecionado(idPedidoFlex)}
      />
    </Tooltip>
  );
  const finalizar = (
    <Tooltip title="Finalizar">
      <Button
        {...buttonCustomizado}
        icon={<AuditOutlined />}
        onClick={() =>
          history.push(`/flex-criterios/manifestar/${idPedidoFlex}`)
        }
      />
    </Tooltip>
  );

  return (
    <Space wrap>
      {detalhar}
      {/MANIFESTANTE|ROOT/.test(perfil) &&
        !/DEFERIDOR/.test(perfil) &&
        etapa.id === constantes.manifestar &&
        manifestacao}

      {/ANALISTA|ROOT/.test(perfil) &&
        etapa.id === constantes.analisar &&
        analise}

      {/DESPACHANTE|ANALISTA|ROOT/.test(perfil) &&
        etapa.id === constantes.despachar &&
        despacho}

      {/ANALISTA|ROOT/.test(perfil) &&
        etapa.id !== constantes.analisar &&
        etapa.id !== constantes.despachar &&
        etapa.id !== constantes.encerrar &&
        avocar}

      {/DEFERIDOR|ROOT/.test(perfil) &&
        etapa.id === constantes.deferir &&
        deferir}

      {/EXECUTANTE|ROOT/.test(perfil) &&
        etapa.id === constantes.finalizar &&
        finalizar}

      {/ANALISTA|ROOT/.test(perfil) &&
        etapa.id !== constantes.encerrar &&
        encerrar}
    </Space>
  );
}
