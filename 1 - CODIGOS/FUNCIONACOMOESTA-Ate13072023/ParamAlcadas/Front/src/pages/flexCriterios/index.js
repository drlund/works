import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import constantes from 'pages/flexCriterios/helpers/constantes';
import BBSpining from 'components/BBSpinning/BBSpinning';
/* import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario'; */
import { Column } from './styles';
import { getListaPedidos } from './apiCalls/flexPedidosAPICall';
import Consulta from './components/consultar/consulta';
import ConsultaResumo from './components/consultar/consultaResumo';
import { usePermissoesUsuario } from './hooks/permissaoAcesso';

export default function Incluir() {
  const [filtroSelecionado, setFiltroSelecionado] = useState(
    constantes.minhasPendencias,
  );
  const [solicitacaoFiltros, setSolicitacaoFiltros] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [loading, setLoading] = useState(false);
  const perfil = usePermissoesUsuario();

  useEffect(() => {
    setLoading(true);
    getListaPedidos(filtroSelecionado)
      .then((pedidos) => {
        setListaFiltrada(pedidos.lista);
        setSolicitacaoFiltros(pedidos.contadores);
      })
      .catch(() => {
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
          <ConsultaResumo
            solicitacaoFiltros={solicitacaoFiltros}
            filtroSelecionado={filtroSelecionado}
            setFiltroSelecionado={setFiltroSelecionado}
            perfil={perfil}
          />
          <Consulta
            perfil={perfil}
            listaFiltrada={listaFiltrada}
            refreshLista={refreshLista}
          />
        </Column>
      </BBSpining>
    )
  );
}
