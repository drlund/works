import React from 'react';
import { Card, Typography } from 'antd';
import { TituloCardStats, CardsStatsRow } from '../../styles';
import estilos from '../../flexCriterios.module.css';
// import constantes from 'pages/flexCriterios/helpers/constantes';

export default function ConsultaResumo({
  solicitacaoFiltros,
  filtroSelecionado,
  setFiltroSelecionado,
  perfil,
}) {
  console.log('SOLICITACAO FILTROS', solicitacaoFiltros);

  const qtFiltros = solicitacaoFiltros?.length;
  const sizeCards = 100 / qtFiltros;
  const sizeQtString = `${sizeCards}%`;

  return (
    <CardsStatsRow>
      {solicitacaoFiltros.map((filtro) => (
        <Card
          key={filtro.id}
          hoverable
          onClick={() => setFiltroSelecionado(filtro.id)}
          title={<TituloCardStats>{filtro.nome}</TituloCardStats>}
          style={{
            width: sizeQtString,
            display: 'flex',
            flexDirection: 'column',

            alignItems: 'center',
          }}
          className={
            filtroSelecionado === filtro.id
              ? estilos.cardResumoSelecionado
              : estilos.cardResumo
          }
        >
          <Typography.Text>{filtro?.valor}</Typography.Text>
        </Card>
      ))}
    </CardsStatsRow>
  );
}
