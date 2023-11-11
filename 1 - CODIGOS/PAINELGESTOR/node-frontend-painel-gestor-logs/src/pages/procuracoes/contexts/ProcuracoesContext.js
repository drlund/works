import { Button, message, Typography } from 'antd';
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState
} from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { SpinningContext, useSpinning } from 'components/SpinningContext';
import { useHistoryPushWithQuery } from 'hooks/useHistoryPushWithQuery';
import PageNotFound from 'pages/errors/PageNotFound';
import { fetch, FETCH_METHODS } from 'services/apis/GenericFetch';

const ProcuracaoContext = createContext(/** @type {Partial<Procuracoes.ProcuracoesContext>} */(/** @type {unknown} */(null)));

/**
 * @param {{
 *  children: React.ReactNode,
 *  defaultDadosProcuracao?: Partial<Procuracoes.DadosProcuracao>,
 *  fluxoProcesso: Procuracoes.TypeForFluxoProcesso
 * }} props
 */
function ProcuracoesContext({
  children,
  defaultDadosProcuracao,
  fluxoProcesso,
}) {
  const [dadosProcuracao, setDadosProcuracao] = useState(
    defaultDadosProcuracao ?? { tipoFluxo: null }
  );
  const [fluxos, setFluxos] = useState((
    defaultDadosProcuracao
      ? ({
        [defaultDadosProcuracao.dadosMinuta.idFluxo]: {
          ...defaultDadosProcuracao.tipoFluxo,
          idFluxo: defaultDadosProcuracao.dadosMinuta.idFluxo
        }
      })
      : null
  ));
  const [error, setError] = useState({
    error: false,
    retryCount: 0,
  });
  const { setLoading } = useSpinning();

  const memoSetDadosProcuracao = useCallback(setDadosProcuracao, []);

  useEffect(() => {
    if (!defaultDadosProcuracao) {
      setLoading(true);
      fetch(FETCH_METHODS.GET, 'procuracoes/minutas/fluxos')
        .then(setFluxos)
        .catch((err) => setError({ ...error, error: err }))
        .finally(() => { setLoading(false); });
    }
  }, [error.retryCount]);

  const contextValue = useMemo(() => /** @satisfies {Partial<Procuracoes.ProcuracoesContext>} */({
    fluxos,
    fluxoProcesso,
    dadosProcuracao,
    setDadosProcuracao: memoSetDadosProcuracao,
  }), [dadosProcuracao, fluxos]);

  /**
   * Cada vez que ocorre um erro, o retryCount é incrementado.
   * Com isso, cada vez demora mais para tentar novamente.
   *
   * Em caso de erro no servidor, isso evita que o usuário
   * fique tentando novamente multiplas vezes.
   */
  function handleErrorClick() {
    setLoading(true);
    const oneSecond = 1000;
    setTimeout(() => {
      const retryBackoffMultiplication = 2;
      setError((lastError) => ({
        error: false,
        retryCount: (lastError.retryCount * retryBackoffMultiplication) + 1
      }));
    }, error.retryCount * oneSecond);
  }

  if (error.error) {
    return (
      <div>
        <Typography.Title type="danger">Erro ao carregar dados.</Typography.Title>
        <Typography.Text code style={{ display: 'block', marginBottom: '2em' }}>{error.error}</Typography.Text>
        <Button onClick={handleErrorClick}>Recarregar</Button>
      </div>
    );
  }

  return (
    <ProcuracaoContext.Provider value={contextValue}>
      {fluxos ? children : null}
    </ProcuracaoContext.Provider>
  );
}

/**
 * @param {{
*  children: React.ReactNode,
*  defaultDadosProcuracao?: Partial<Procuracoes.DadosProcuracao>,
*  fluxoProcesso: Procuracoes.TypeForFluxoProcesso
* }} props
*/
export default function ProcuracoesContextWrapper({ children, defaultDadosProcuracao, fluxoProcesso }) {
  return (
    <SpinningContext>
      <ProcuracoesContext defaultDadosProcuracao={defaultDadosProcuracao} fluxoProcesso={fluxoProcesso}>
        {children}
      </ProcuracoesContext>
    </SpinningContext>
  );
}

/**
 * @param {{
*  children: React.ReactNode,
*  fluxoProcesso: Procuracoes.TypeForFluxoProcesso
* }} props
*/
function ProcuracoesContextWithDefaultDados({ children, fluxoProcesso }) {
  const [defaultDados, setDefaultDados] = useState(null);
  const [error, setError] = useState(false);
  const historyPush = useHistoryPushWithQuery();

  const { setLoading } = useSpinning();
  /**
   * @type {{idMinuta: string, idMassificado: string}}
   */
  const { idMinuta, idMassificado } = useParams();
  const history = useHistory();

  const continueRoute = (() => {
    if (idMinuta) {
      return `/procuracoes/minutas/regenerate/${idMinuta}`;
    }
    if (idMassificado) {
      return `/procuracoes/massificado/minuta/regenerate/${idMassificado}`;
    }
    return false;
  })();

  useEffect(() => {
    let timeout = /** @type {NodeJS.Timeout} */ (/** @type {unknown} */ (null));
    if (continueRoute) {
      setLoading(true);
      Promise.race([
        fetch(FETCH_METHODS.GET, continueRoute)
          .then(setDefaultDados),

        new Promise((_, reject) => {
          const oneSecond = 1000;
          timeout = setTimeout(() => {
            reject('Erro ao buscar minuta');
          }, 30 * oneSecond);
        })
      ])
        .catch((err) => {
          const fiveSeconds = 5;
          message.error(
            err,
            fiveSeconds,
            () => historyPush(history.location.pathname.replace(idMinuta || idMassificado, ''))
          );
          setError(err);
        })
        .finally(() => {
          clearTimeout(timeout);
          setLoading(false);
        });
    }

    return () => clearTimeout(timeout);
  }, [idMinuta, idMassificado]);

  if (error) {
    return <PageNotFound />;
  }

  if (!defaultDados) {
    return null;
  }

  return (
    <ProcuracoesContext defaultDadosProcuracao={defaultDados} fluxoProcesso={fluxoProcesso}>
      {children}
    </ProcuracoesContext>
  );
}

/**
 * @param {{
*  children: React.ReactNode,
*  fluxoProcesso: Procuracoes.TypeForFluxoProcesso
* }} props
*/
export function ProcuracoesContextWithDefaultDadosWrapper({ children, fluxoProcesso }) {
  return (
    <SpinningContext>
      <ProcuracoesContextWithDefaultDados fluxoProcesso={fluxoProcesso}>
        {children}
      </ProcuracoesContextWithDefaultDados>
    </SpinningContext>
  );
}

export function useCadastroProcuracao() {
  return useContext(ProcuracaoContext);
}
