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
import { useSelector } from 'react-redux';

const buttonCustomizado = {
  type: 'secondary',
  shape: 'square',
};

// eslint-disable-next-line no-undef
export default function ConsultaAcoes({
  idPedidoFlex,
  pedidoFlex,
  etapa,
  perfil,
  setIdAvocarSelecionado,
  setIdEncerrarSelecionado,
  filtroSelecionado,
}) {
  const telaMinhasPendencias = filtroSelecionado == 1 ? true : null;

  const usuario = useSelector(({ app }) => app.authState.sessionData);

  const isMyTurn = (manifestacoes, usuario) => {
    const pendenciaAtual = manifestacoes.find(
      (single) => single.id_situacao == 1,
    );
    //Verifica se é uma das que estão no array das minhas subordinadas
    const ehMinhaPendencia = pendenciaAtual?.prefixo.includes(
      usuario.prefixo_efetivo,
    );

    //Testar
    if (ehMinhaPendencia) {
      const previousRegistrada = manifestacoes.find(
        (el) =>
          el.ordemManifestacao === pendenciaAtual.ordemManifestacao - 1 &&
          (el.id_situacao === 2 || el.id_situacao === 3),
      );

      if (previousRegistrada) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const possoManifestar =
    /MANIFESTANTE/.test(perfil) && etapa.id === constantes.manifestar
      ? isMyTurn(pedidoFlex?.manifestacoes, usuario)
      : false;

  // Verificando quais as diretorias gestores autorizados.
  const isGestorDestino = verificarPermissaoGestorDestino(perfil, pedidoFlex);

  // Verificando quais as diretorias gestores autorizados.
  const isOperadorDestino = verificarPermissaoOperadorDestino(
    perfil,
    pedidoFlex,
  );

  // Verificando quais as diretorias gestores autorizados.
  const ehDeferidor = verificarPermissaoDeferidor(perfil, pedidoFlex.id);

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
      {telaMinhasPendencias &&
        etapa.id === constantes.manifestar &&
        /MANIFESTANTE/.test(perfil) &&
        !/DEFERIDOR|ANALISTA/.test(perfil) &&
        possoManifestar &&
        manifestacao}

      {/ANALISTA|ROOT/.test(perfil) &&
        etapa.id === constantes.analisar &&
        isGestorDestino &&
        analise}

      {/DESPACHANTE|ROOT/.test(perfil) &&
        etapa.id == constantes.despachar &&
        despacho}

      {/ANALISTA|ROOT/.test(perfil) &&
        //Não pode estar em analise, em despacho e encerrado
        etapa.id !== constantes.analisar &&
        etapa.id !== constantes.despachar &&
        etapa.id !== constantes.encerrar &&
        isGestorDestino &&
        avocar}

      {telaMinhasPendencias &&
        /DEFERIDOR|ROOT/.test(perfil) &&
        etapa.id === constantes.deferir &&
        ehDeferidor &&
        deferir}

      {telaMinhasPendencias &&
        /EXECUTANTE|ROOT/.test(perfil) &&
        etapa.id === constantes.finalizar &&
        isOperadorDestino &&
        finalizar}

      {(/MANIFESTANTE|DEFERIDOR/.test(perfil) ||
        isGestorDestino ||
        isOperadorDestino) &&
        etapa.id !== constantes.encerrar &&
        telaMinhasPendencias &&
        encerrar}
    </Space>
  );
}

/**
 * @param {any[]} perfil
 * @param {string} id
 */
function verificarPermissaoDeferidor(perfil, id) {
  /** @type {{ deferidor: string[] }} */
  const foundDeferidor = perfil.find(
    (/** @type {{ deferidor: string[] }} */ p) => p?.deferidor,
  );
  const idsSolicitacoesDeferidor = foundDeferidor?.deferidor || [];
  return idsSolicitacoesDeferidor.includes(id);
}

/**
 * @param {any[]} perfil
 * @param {{ analise: { dadosDestino: string; }; }} pedidoFlex
 */
function verificarPermissaoOperadorDestino(perfil, pedidoFlex) {
  const dadosDestino = JSON.parse(pedidoFlex?.analise.dadosDestino);
  const prefixoDiretoriaDestino = dadosDestino?.prefixoDiretoria;

  /** @type {{ operadorUnidadeAlvo: string[] }} */
  const foundOperadorUnidadeAlvo = perfil.find(
    (/** @type {{ operadorUnidadeAlvo: string[] }} */ p) =>
      p?.operadorUnidadeAlvo,
  );

  const operadorUnidadeAlvo =
    foundOperadorUnidadeAlvo?.operadorUnidadeAlvo || [];

  return operadorUnidadeAlvo.includes(prefixoDiretoriaDestino);
}

/**
 * @param {any[]} perfil
 * @param {{ analise: { dadosDestino: string; }; }} pedidoFlex
 */
function verificarPermissaoGestorDestino(perfil, pedidoFlex) {
  const dadosDestino = JSON.parse(pedidoFlex?.analise.dadosDestino);
  const prefixoDiretoriaDestino = dadosDestino?.prefixoDiretoria;

  /** @type {{ gestorUnidadeAlvo: string[] }} */
  const foundGestorUnidadeAlvo = perfil.find(
    (/** @type {{ gestorUnidadeAlvo: string[] }} */ p) => p?.gestorUnidadeAlvo,
  );

  const gestorUnidadeAlvo = foundGestorUnidadeAlvo?.gestorUnidadeAlvo || [];
  return gestorUnidadeAlvo.includes(prefixoDiretoriaDestino);
}
