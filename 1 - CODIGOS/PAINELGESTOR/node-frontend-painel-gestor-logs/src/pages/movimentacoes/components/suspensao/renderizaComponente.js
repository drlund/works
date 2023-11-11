import React from 'react';
import history from '@/history';
import FormParamSuspensaoPatch from './FormParamSuspensaoPatch';
import ParamSuspensaoTable from '../../ParamSuspensaoTable';

function renderizaComponente() {
  const handleSuspensao = (id) => {
    history.push({
      pathname: '/movimentacoes/editar-suspensao/',
    })
  };

  return (
    <div>
      <FormParamSuspensaoPatch handleSuspensao={handleSuspensao} />
      <ParamSuspensaoTable handleSuspensao={handleSuspensao} />
    </div>
  );
}

export default renderizaComponente;