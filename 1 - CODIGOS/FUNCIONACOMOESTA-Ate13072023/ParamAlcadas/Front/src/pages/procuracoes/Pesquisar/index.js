import CardSecao from 'components/CardSecao';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AcordeaoProcuracoes } from '../innerComponents/AcordeaoProcuracoes';
import { ItemAcordeao } from '../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa';
import { PesquisaComponent } from '../innerComponents/PesquisaComponent';
import { PesquisasContext } from './PesquisaContext';

/**
 * @typedef {Procuracoes.Poderes['outorgantes']} Outorgantes
 */

function Pesquisar() {
  const [outorgados, setOutorgados] = useState(/** @type {Outorgantes} */([]));

  /**
   * @param {Outorgantes} listaOutorgados
   */
  const handlePesquisa = (listaOutorgados) => setOutorgados([...listaOutorgados]);

  const semOutorgados = !outorgados || outorgados.length === 0;

  return (
    <PesquisasContext>
      <CardSecao title="Pesquisar por procuração cadastrada">
        <PesquisaComponent
          handlePesquisa={handlePesquisa}
          showAll
        />
      </CardSecao>
      {
        (semOutorgados)
          ? null
          : (
            <AcordeaoWrapper>
              <CardSecao
                title="Procurações cadastradas"
              >
                <AcordeaoProcuracoes
                  outorgados={outorgados}
                  ItemAcordeao={ItemAcordeao}
                />
              </CardSecao>
            </AcordeaoWrapper>
          )
      }
    </PesquisasContext>
  );
}

export default Pesquisar;

const AcordeaoWrapper = styled.div`
  margin-top: 1em;
  width: 100%;
`;
