import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import history from 'history.js';
import SearchTable from 'components/searchtable/SearchTable';
import { inserirManifestacao } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import constantes from 'pages/flexCriterios/helpers/constantes';
import ModalAvocar from '../commons/modalAvocar';
import ColunasConsulta from './consultaColunasConfig';
import ModalEncerrar from '../commons/modalEncerrar';

export default function Consulta({ perfil, listaFiltrada, refreshLista }) {
  const [isModalAvocarOpen, setIsModalAvocarOpen] = useState(false);
  const [isModalEncerrarOpen, setIsModalEncerrarOpen] = useState(false);
  const [idAvocarSelecionado, setIdAvocarSelecionado] = useState(null);
  const [idEncerrarSelecionado, setIdEncerrarSelecionado] = useState(null);

  useEffect(() => {
    idAvocarSelecionado
      ? setIsModalAvocarOpen(true)
      : setIsModalAvocarOpen(false);
  }, [idAvocarSelecionado]);

  useEffect(() => {
    idEncerrarSelecionado
      ? setIsModalEncerrarOpen(true)
      : setIsModalEncerrarOpen(false);
  }, [idEncerrarSelecionado]);

  const gravarManifestacao = (manifestacao) => {
    inserirManifestacao(manifestacao)
      .then(() => {
        if (manifestacao.idDispensa === constantes.dispensaEncerrado) {
          setIdEncerrarSelecionado(null);
          message.success('Pedido encerrado com sucesso.');
          refreshLista();

          return history.push(`/flex-criterios/`);
        }
        if (manifestacao.idDispensa === constantes.dispensaAvocada) {
          setIdAvocarSelecionado(null);
          message.success('Pedido avocado com sucesso.');
          refreshLista();
        }

        if (
          manifestacao.idDispensa !== constantes.dispensaAvocada ||
          manifestacao.idDispensa !== constantes.dispensaEncerrado
        ) {
          message.success('Parecer Registrado.');
          refreshLista();
        }
        return null;
      })
      .catch((resposta) => {
        if (manifestacao.idDispensa === constantes.dispensaEncerrado) {
          setIdEncerrarSelecionado(null);
        }
        if (manifestacao.idDispensa === constantes.dispensaAvocada) {
          setIdAvocarSelecionado(null);
        }
        message.error(resposta);
      });
  };

  return (
    <Card
      title="Consultar Pedidos"
      extra={
        /SOLICITANTE|ROOT|ANALISTA|DESPACHANTE/.test(perfil) && (
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => history.push(`/flex-criterios/incluir`)}
          >
            Adicionar Pedido
          </Button>
        )
      }
    >
      <SearchTable
        rowKey={(registro) => registro.id}
        columns={ColunasConsulta({
          setIdAvocarSelecionado,
          setIdEncerrarSelecionado,
          perfil,
        })}
        dataSource={listaFiltrada}
        tableLayout="fixed"
      />
      <ModalAvocar
        isModalAvocarOpen={isModalAvocarOpen}
        setIsModalAvocarOpen={setIsModalAvocarOpen}
        gravarManifestacao={gravarManifestacao}
        idPedidoFlex={idAvocarSelecionado}
      />
      <ModalEncerrar
        isModalEncerrarOpen={isModalEncerrarOpen}
        setIsModalEncerrarOpen={setIsModalEncerrarOpen}
        gravarManifestacao={gravarManifestacao}
        idPedidoFlex={idEncerrarSelecionado}
      />
    </Card>
  );
}
