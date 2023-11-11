import React, { useEffect, useState } from 'react';
import { Badge, Card, message, Space, Tag, Typography } from 'antd';
import constantes from 'pages/flexCriterios/helpers/constantes';
import BBSpining from 'components/BBSpinning/BBSpinning';
import { Column } from './styles';
import { getListaPedidos } from './apiCalls/flexPedidosAPICall';
import Consulta from './components/consultar/consulta';
import ConsultaResumo from './components/consultar/consultaResumo';
import { usePermissoesUsuario } from './hooks/permissaoAcesso';
import { FileSearchOutlined } from '@ant-design/icons';
import { toggleSideBar } from '@/services/actions/commons';
import { useDispatch } from 'react-redux';

export default function Incluir() {
  const dispatch = useDispatch();

  const [filtroSelecionado, setFiltroSelecionado] = useState(
    constantes.minhasPendencias,
  );
  const [solicitacaoFiltros, setSolicitacaoFiltros] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [loading, setLoading] = useState(false);
  const perfil = usePermissoesUsuario();
  const isAnalistaDespachante = /ANALISTA|DESPACHANTE/.test(perfil);

  //Somente minhas pendencias e todos
  const filteredFiltros = solicitacaoFiltros.filter(
    (el) => el.id == 1 || el.id == 2,
  );

  useEffect(() => {
    dispatch(toggleSideBar(true));
    setLoading(true);
    getListaPedidos(filtroSelecionado)
      .then((pedidos) => {
        setListaFiltrada(pedidos.lista);
        setSolicitacaoFiltros(pedidos.contadores);
      })
      .catch(() => {
        setListaFiltrada([]);
        setSolicitacaoFiltros([]);
        message.error(
          'Não foi possível obter a lista de flexibilizações deste prefixo',
        );
      })
      .finally(() => setLoading(false));
  }, [filtroSelecionado]);

  const refreshLista = () => {
    setLoading(true);
    getListaPedidos(filtroSelecionado)
      .then((pedidos) => {
        setListaFiltrada(pedidos.lista);
        setSolicitacaoFiltros(pedidos.contadores);
      })
      .catch(() => {
        setListaFiltrada([]);
        setSolicitacaoFiltros([]);
        message.error(
          'Não foi possível obter a lista de flexibilizações deste prefixo',
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    listaFiltrada && (
      <BBSpining spinning={loading}>
        <Column>
          <Card
            style={{
              width: '100%',
            }}
          >
            <p>
              Este ambiente destina-se a inclusão e acompanhamento de
              solicitações de flexibilização de critérios e impedimentos.
            </p>
            <ul>
              <li>
                <p>Para mais informações, consulte a IN 369-1.</p>
              </li>
            </ul>
            <ul>
              <li>
                <p>
                  Para inclusão de uma nova solicitação, utilize o botão abaixo,
                  buscando pela matrícula do(a) funcionário(a) para o(a) qual
                  será feito o pedido.
                </p>
              </li>
            </ul>
          </Card>
          <Space
            direction="vertical"
            style={{
              minWidth: '100%',
              margin: -15,
              alignItems: 'center',
            }}
          >
            <Tag
              style={{
                fontSize: 22,
                fontWeight: 'normal',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              icon={
                <FileSearchOutlined
                  style={{ /* fontSize: '150%',  */ color: '#002D4B' }}
                />
              }
              color="default"
            >
              Filtros
            </Tag>
          </Space>

          <ConsultaResumo
            solicitacaoFiltros={
              isAnalistaDespachante ? solicitacaoFiltros : filteredFiltros
            }
            filtroSelecionado={filtroSelecionado}
            setFiltroSelecionado={setFiltroSelecionado}
            perfil={perfil}
          />
          <Consulta
            filtroSelecionado={filtroSelecionado}
            perfil={perfil}
            listaFiltrada={listaFiltrada}
            refreshLista={refreshLista}
          />
        </Column>
      </BBSpining>
    )
  );
}
