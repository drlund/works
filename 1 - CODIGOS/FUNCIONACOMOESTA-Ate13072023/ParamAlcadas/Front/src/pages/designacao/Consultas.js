import React from 'react';
import moment from 'moment';

import ConsultaTabela from 'pages/designacao/Consultas/ConsultaTabela';

function Consultas() {
  return <ConsultaTabela key={moment().valueOf()} />;
}

export default React.memo(Consultas);
