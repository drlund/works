import React from 'react';
import { CardsRow, MainContainer } from 'pages/flexCriterios/styles';
import { Button, message } from 'antd';
import { inserirDespacho } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import history from 'history.js';
import constantes from '../../helpers/constantes';
import FormularioManifestacao from './formManifestarAnalisarDeferir';
import AnaliseDespacho from './formAnaliseDespacho';

export default function Despacho({ pedidoFlex, perfil }) {
  const hackAvancarEtapa = pedidoFlex.manifestacoes.filter(
    (manifestacao) =>
      manifestacao.acao.id == constantes.acaoDeferir &&
      (manifestacao.situacao.id == constantes.situacaoRegistrada ||
        manifestacao.situacao.id == constantes.situacaoDispensada),
  );

  console.log('HACK LENGTH', hackAvancarEtapa.length);

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

  const avancarDespacho = () => {
    const despacho = {
      idSolicitacao: pedidoFlex.id,
      avancar: true,
    };

    inserirDespacho(despacho)
      .then(() => {
        message.success('Despacho Realizado.');
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  function renderDespacho() {
    if (
      perfil.includes(constantes.perfilDespachante) ||
      perfil.includes(constantes.perfilRoot)
    ) {
      if (
        pedidoFlex.funcionarioEnvolvido.prefixoDestino.prefixoDiretoria !==
        pedidoFlex.funcionarioEnvolvido.prefixoOrigem.prefixoDiretoria
      ) {
        return (
          <>
            <CardsRow>
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
                  pedidoFlex.funcionarioEnvolvido.prefixoDestino.nomeDiretoria,
                  'Diretoria Destino',
                ]}
              />
              <AnaliseDespacho
                key={
                  pedidoFlex.funcionarioEnvolvido.prefixoOrigem.prefixoDiretoria
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
            </CardsRow>
            {hackAvancarEtapa.length >= 2 ? (
              <Button
                style={{ marginBottom: '20px' }}
                onClick={() => avancarDespacho()}
              >
                Avançar Etapa{' '}
              </Button>
            ) : null}
          </>
        );
      }
      return (
        <>
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

          {hackAvancarEtapa.length >= 2 ? (
            <Button
              style={{ marginBottom: '20px' }}
              onClick={() => avancarDespacho()}
            >
              Avançar Etapa{' '}
            </Button>
          ) : null}
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
