import React from 'react';

import Acesso from 'components/Acesso/Acesso';
import Validacao from './ValidacaoRH/ValidacaoRH';

function ValidacaoRH() {
  return (
    <Acesso
      ferramenta="Validação RH"
      listaAcessos={['Acesso']}
      componente={<Validacao />}
    />
  );
}

export default ValidacaoRH;
