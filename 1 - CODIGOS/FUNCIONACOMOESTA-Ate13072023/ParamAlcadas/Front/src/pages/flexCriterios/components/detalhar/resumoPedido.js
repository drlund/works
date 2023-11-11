import React, { useEffect, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { getPedido } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import { usePermissoesUsuario } from 'pages/flexCriterios/hooks/permissaoAcesso';
import { CardResponsivo, CardsRow, MainContainer } from '../../styles';
import Etapas from '../commons/etapas';
import Funcionario from '../commons/funcionario';
import Resumo from '../commons/resumo';
import Cadeia from '../commons/cadeia';

import { UploadOutlined } from '@ant-design/icons';

export default function ResumoPedido({
  match: {
    params: { idFlex },
  },
}) {
  const [pedidoFlex, setPedidoFlex] = useState(null);
  const perfil = usePermissoesUsuario();

  useEffect(() => {
    getPedido(idFlex)
      .then((resposta) => {
        setPedidoFlex(resposta);
      })
      .catch(() => message.error('Não foi possível localizar este pedido.'));
  }, []);

  return (
    pedidoFlex && (
      <MainContainer>
        <Etapas etapaAtual={pedidoFlex?.etapa?.sequencial} />
        <Funcionario acao={pedidoFlex?.etapa?.id} pedidoFlex={pedidoFlex} />
        <CardsRow style={{ top: 0 }}>
          <CardResponsivo
            title="Resumo do Pedido"
            actions={[
              <>
                <Button
                  key={pedidoFlex?.id}
                  type="primary"
                  onClick={() =>
                    window
                      .open(
                        `/v8/flex-criterios/detalhar/${pedidoFlex?.id}`,
                        '_blank',
                      )
                      .focus()
                  }
                >
                  Visualizar Detalhes
                </Button>
              </>,
            ]}
          >
            <Resumo pedidoFlex={pedidoFlex} />
          </CardResponsivo>
          <Cadeia
            acao={pedidoFlex?.etapa?.id}
            pedidoFlex={pedidoFlex}
            perfil={perfil}
          />
        </CardsRow>
      </MainContainer>
    )
  );
}
