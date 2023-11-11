import React from 'react';
import StyledCard from 'components/styledcard/StyledCardPrimary';
import commonColumns from "./visaoPainelDicoiColumns";
import SearchTable from 'components/searchtable/SearchTable';

const ListaPainelDicoi = props => {
  return (
    <StyledCard title="Registros">
      <SearchTable 
        columns={commonColumns}
        dataSource={props.analises}
        scroll={{ x: 'auto' }}
      />
    </StyledCard>
  );
}

export default ListaPainelDicoi;