import React from 'react';
import { CardsRow, MainContainer } from 'pages/flexCriterios/styles';
import { Button /* message */ } from 'antd';
/* import { inserirDespacho } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall'; */
/* import history from 'history.js'; */
import constantes from '../../helpers/constantes';
import FormularioManifestacao from './formManifestarAnalisarDeferir';
import AnaliseDespacho from './formAnaliseDespacho';

export default function Despacho({ pedidoFlex, perfil }) {
  /* const hackAvancarEtapa = pedidoFlex.manifestacoes.filter(
    (manifestacao) =>
      manifestacao.acao.id == constantes.acaoDeferir &&
      (manifestacao.situacao.id == constantes.situacaoRegistrada ||
        manifestacao.situacao.id == constantes.situacaoDispensada),
  ); */

  // Verificando quais as diretorias gestores autorizados.
  /** @type {{ gestorUnidadeAlvo: string[] }} */
  const foundGestorUnidadeAlvo = perfil.find(
    (/** @type {{ gestorUnidadeAlvo: string[] }} */ p) => p?.gestorUnidadeAlvo,
  );
  const gestorUnidadeAlvo = foundGestorUnidadeAlvo?.gestorUnidadeAlvo || [];
  const isDespachanteDestino = gestorUnidadeAlvo.includes(
    pedidoFlex.funcionarioEnvolvido.prefixoDestino.prefixoDiretoria,
  );
  const isDespachanteOrigem = gestorUnidadeAlvo.includes(
    pedidoFlex.funcionarioEnvolvido.prefixoOrigem.prefixoDiretoria,
  );

  const isAnalise = pedidoFlex?.etapa?.id === constantes.despachar && {
    titulo: 'Análise',
    exibirAcoes: false,
    exibirItensForm: false,
    mensagemErro: '',
  };
  const isDespacho = pedidoFlex?.etapa?.id === constantes.despachar && {
    titulo: 'Despacho',
    exibirAcoes: false,
    exibirItensForm: false,
    mensagemErro: 'Pendente de despacho.',
  };

  const analisado = pedidoFlex?.manifestacoes?.filter(
    (manifestacao) => manifestacao.acao.id === constantes.analisar,
  );

  /*  const manifestacoesAnteriores = getManifestacoesAnteriores(
    pedidoFlex?.manifestacoes,
  ); */

  function renderDespacho() {
    if (
      perfil.includes(constantes.perfilDespachante) ||
      perfil.includes(constantes.perfilRoot)
    ) {
      //Caso das diretorias origem/destino diferentes (2 despachos)
      if (
        pedidoFlex.funcionarioEnvolvido.prefixoDestino.prefixoDiretoria !==
        pedidoFlex.funcionarioEnvolvido.prefixoOrigem.prefixoDiretoria
      ) {
        return (
          <>
            <CardsRow>
              {isDespachanteDestino && (
                <AnaliseDespacho
                  key={
                    pedidoFlex.funcionarioEnvolvido.prefixoDestino
                      .prefixoDiretoria
                  }
                  idFlex={pedidoFlex.id}
                  totalMembrosComite={
                    pedidoFlex.funcionarioEnvolvido.prefixoDestino
                      .totalComiteDiretoria
                  }
                  diretoria={[
                    pedidoFlex.funcionarioEnvolvido.prefixoDestino
                      .prefixoDiretoria,
                    pedidoFlex.funcionarioEnvolvido.prefixoDestino
                      .nomeDiretoria,
                    'Diretoria Destino',
                  ]}
                />
              )}
              {isDespachanteOrigem && (
                <AnaliseDespacho
                  key={
                    pedidoFlex.funcionarioEnvolvido.prefixoOrigem
                      .prefixoDiretoria
                  }
                  idFlex={pedidoFlex.id}
                  totalMembrosComite={
                    pedidoFlex.funcionarioEnvolvido.prefixoOrigem
                      .totalComiteDiretoria
                  }
                  diretoria={[
                    pedidoFlex.funcionarioEnvolvido.prefixoOrigem
                      .prefixoDiretoria,
                    pedidoFlex.funcionarioEnvolvido.prefixoOrigem.nomeDiretoria,
                    'Diretoria Origem',
                  ]}
                />
              )}
            </CardsRow>
          </>
        );
      }

      //Caso diretoria destino/origem serem a mesm (1 despacho)
      return (
        <>
          {isDespachanteDestino && (
            <AnaliseDespacho
              key={
                pedidoFlex.funcionarioEnvolvido.prefixoDestino.prefixoDiretoria
              }
              idFlex={pedidoFlex.id}
              totalMembrosComite={pedidoFlex.totalMembrosComite}
              diretoria={[
                pedidoFlex.funcionarioEnvolvido.prefixoDestino.prefixoDiretoria,
                pedidoFlex.funcionarioEnvolvido.prefixoDestino.nomeDiretoria,
                'Diretoria Destino',
              ]}
            />
          )}

          {/*   {hackAvancarEtapa.length >= 2 ? (
            <Button
              style={{ marginBottom: '20px' }}
              onClick={() => avancarDespacho()}
            >
              Avançar Etapa{' '}
            </Button>
          ) : null} */}
        </>
      );
    }

    return (
      <FormularioManifestacao
        titulo={isDespacho.titulo}
        exibirAcoes={isDespacho.exibirAcoes}
        exibirItensForm={isDespacho.exibirItensForm}
        mensagemErro={isDespacho.mensagemErro}
      />
    );
  }

  return (
    <MainContainer>
      <FormularioManifestacao
        titulo={isAnalise.titulo}
        exibirAcoes={isAnalise.exibirAcoes}
        exibirItensForm={isAnalise.exibirItensForm}
        analises={analisado}
      />
      {pedidoFlex?.etapa?.id === constantes.despachar && renderDespacho()}
    </MainContainer>
  );
}
