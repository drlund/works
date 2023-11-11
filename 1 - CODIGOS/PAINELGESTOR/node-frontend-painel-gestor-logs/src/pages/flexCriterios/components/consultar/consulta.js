import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import history from 'history.js';
import SearchTable from 'components/searchtable/SearchTable';
import {
  deferirEmLote,
  inserirManifestacao,
} from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import constantes from 'pages/flexCriterios/helpers/constantes';
import ModalAvocar from '../commons/modalAvocar';
import ColunasConsulta from './consultaColunasConfig';
import ModalEncerrar from '../commons/modalEncerrar';
import BBSpining from '@/components/BBSpinning/BBSpinning';

export default function Consulta({
  perfil,
  listaFiltrada,
  refreshLista,
  filtroSelecionado,
}) {
  /*   console.log('LISTA FILTRADA', listaFiltrada); */

  // Create a new array to multiply the same order many times
  /*  const newArray = []; */

  // Function to clone an object
  /*   function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  } */

  // Function to add objects to the new array with unique IDs
  /*  function addObjectsWithUniqueIds(originalObj, count) {
    for (let i = 1; i <= count; i++) {
      const newObj = cloneObject(originalObj);
      newObj.id = newArray.length + 1; 
      newArray.push(newObj);
    }
  } */

  // Add 10 copies of each object to the new array
  /*   listaFiltrada.forEach((obj) => {
    addObjectsWithUniqueIds(obj, 10);
  }); */

  /* console.log(newArray); */

  const [isModalAvocarOpen, setIsModalAvocarOpen] = useState(false);
  const [isModalEncerrarOpen, setIsModalEncerrarOpen] = useState(false);
  const [idAvocarSelecionado, setIdAvocarSelecionado] = useState(null);
  const [idEncerrarSelecionado, setIdEncerrarSelecionado] = useState(null);

  const podeAprovarEmLote = perfil.some((p) => p?.deferidor);

  const [loading, setLoading] = useState(false);

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
          return refreshLista();
        }

        if (
          manifestacao.idDispensa !== constantes.dispensaAvocada ||
          manifestacao.idDispensa !== constantes.dispensaEncerrado
        ) {
          message.success('Parecer Registrado.');
          return refreshLista();
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

  const [selecionados, setSelecionados] = useState([]);

  const onAprovarEmLote = () => {
    setLoading(true);
    deferirEmLote(selecionados)
      .then(() => {
        message.success('Pedido Deferido.');
        setSelecionados([]);
        setLoading(false);
        return refreshLista();
      })
      .catch((resposta) => {
        setSelecionados([]);
        setLoading(false);
        message.error(resposta);
      });
  };

  return (
    <BBSpining spinning={loading}>
      <Card
        title="Consultar Pedidos"
        extra={
          <>
            {/SOLICITANTE|ROOT|ANALISTA|DESPACHANTE/.test(perfil) && (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => history.push(`/flex-criterios/incluir`)}
              >
                Adicionar Pedido
              </Button>
            )}
          </>
        }
        actions={[
          <>
            {filtroSelecionado == 1 && podeAprovarEmLote && (
              <Button
                type="primary"
                size="small"
                disabled={selecionados.length === 0}
                onClick={() => onAprovarEmLote()}
              >
                Aprovar Selecionadas em lote
              </Button>
            )}
          </>,
        ]}
      >
        <SearchTable
          scroll={{ x: true }}
          rowKey={(registro) => registro.id}
          columns={ColunasConsulta({
            listaFiltrada /* : newArray,  */,
            filtroSelecionado,
            setIdAvocarSelecionado,
            setIdEncerrarSelecionado,
            setSelecionados,
            podeAprovarEmLote,
            selecionados,
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
    </BBSpining>
  );
}
