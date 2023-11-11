import { Collapse } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * @param {{
 *  outorgados: Procuracoes.Outorgante[],
 *  ItemAcordeao: ReturnType<import('./ItemAcordeaoCadastro').ItemAcordeaoCadastro> | import('./ItemAcordeaoPesquisa').ItemAcordeaoPesquisa
 * }} props
 */
export function AcordeaoProcuracoes({ outorgados, ItemAcordeao }) {
  const firstOutorgado = `${outorgados[0]?.matricula}${outorgados[0]?.idProcuracao}${outorgados[0]?.idProxy}`;
  const [activePanel, setActivePanel] = useState(/** @type {string|string[]} */(firstOutorgado));

  useEffect(() => {
    setActivePanel(firstOutorgado);
  }, [outorgados]);

  if (!outorgados || outorgados.length === 0) {
    return null;
  }

  return (
    <Collapse
      accordion
      activeKey={activePanel}
      onChange={setActivePanel}
    >
      {
        outorgados.map((outorgado) => (
          <ItemAcordeao
            isShowing={activePanel === `${outorgado.matricula}${outorgado.idProcuracao}${outorgado.idProxy}`}
            outorgado={outorgado}
            key={`${outorgado.matricula}${outorgado.idProcuracao}${outorgado.idProxy}`}
          />
        ))
      }
    </Collapse>

  );
}
