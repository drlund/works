import React, { useEffect, useState } from 'react';
import { Card, Space, Typography, message } from 'antd';
import { getPedido } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import { Column, Row } from '../../styles';
import constantes from '../../helpers/constantes';
import PrefixoOrigem from '../commons/cardPrefixoOrigem';
import PrefixoDestino from '../commons/cardPrefixoDestino';
import Validacoes from '../commons/validacoes';
import Resumo from '../commons/resumo';

export default function DetalhePedido({
  match: {
    params: { idFlex },
  },
}) {
  const [pedidoFlex, setPedidoFlex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPedido(idFlex)
      .then((resposta) => {
        setPedidoFlex(resposta);
      })
      .catch(() => message.error('Não foi possível localizar este pedido.'))
      .finally(() => setLoading(false));
  }, []);
  return pedidoFlex ? (
    <Card>
      <Column>
      <Typography.Text>
        <Typography.Text strong>Tipo(s) de Flexibilização</Typography.Text>
        : <Space>{pedidoFlex?.tiposSolicitacao?.map(tipo => tipo.nome)}</Space>
      </Typography.Text>
        <Resumo pedidoFlex={pedidoFlex} />
         <Row>
          <PrefixoOrigem
            funcionarioEnvolvido={pedidoFlex.funcionarioEnvolvido}
          />
          <PrefixoDestino
            acao={constantes.detalhar}
            funcionarioEnvolvido={pedidoFlex.funcionarioEnvolvido}
          />
         </Row>
        <Validacoes
          funcionarioEnvolvido={pedidoFlex?.funcionarioEnvolvido}
          loading={loading}
        />
      </Column>
    </Card>
  ) : null;
}
