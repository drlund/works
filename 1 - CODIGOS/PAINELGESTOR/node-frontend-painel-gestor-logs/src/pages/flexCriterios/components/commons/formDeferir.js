import React from 'react';
import { message } from 'antd';
import { inserirDeferimento } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import { getManifestacoesAnteriores } from 'pages/flexCriterios/helpers/funcoesAuxiliares';
import history from 'history.js';
import FormularioManifestacao from './formManifestarAnalisarDeferir';
import constantes from '../../helpers/constantes';
import { useDispatch, useSelector } from 'react-redux';
import { reloadUserPermissions } from '@/services/actions/commons';

export default function Deferir({ tipoManifestacao, pedidoFlex, perfil }) {
  const authState = useSelector(({ app }) => app.authState);
  const dispatch = useDispatch();
  const isAnalise = pedidoFlex?.etapa?.id === constantes.deferir && {
    titulo: 'Análise',
    exibirAcoes: false,
    exibirItensForm: false,
    mensagemErro: '',
  };
  const isDeferimento =
    (perfil.includes(constantes.perfilDeferidor) ||
      perfil.includes(constantes.perfilRoot)) &&
    pedidoFlex?.etapa?.id === constantes.deferir
      ? {
          titulo: 'Deferimento',
          exibirAcoes: true,
          exibirItensForm: true,
          mensagemErro: '',
        }
      : {
          titulo: 'Deferimento',
          exibirAcoes: false,
          exibirItensForm: false,
          mensagemErro:
            pedidoFlex?.etapa?.id < constantes.deferir
              ? 'Existem Análises pendentes.'
              : 'Pendente de despacho.',
        };

  const analisado = pedidoFlex?.manifestacoes?.filter(
    (manifestacao) => manifestacao.acao.id === constantes.analisar,
  );
  const deferido = pedidoFlex?.manifestacoes?.filter(
    (manifestacao) =>
      manifestacao.acao.id === constantes.deferir &&
      manifestacao.situacao.id === 2,
  );
  const manifestacoesAnteriores = getManifestacoesAnteriores(
    pedidoFlex?.manifestacoes,
  );

  const jaSeManifestou = pedidoFlex?.manifestacoes.find(
    (eleme) =>
      eleme.acao.id !== 1 &&
      eleme.situacao.id === 2 &&
      eleme.matricula === authState.sessionData.matricula,
  );

  const idEscalaoDeferidorMatricula = 4;
  const faltaManifestar = pedidoFlex?.manifestacoes.find(
    (eleme) =>
      eleme.acao.id !== 1 &&
      eleme.situacao.id === 1 &&
      /*      eleme.matricula === authState.sessionData.matricula, */
      eleme.id_escalao !== idEscalaoDeferidorMatricula
        ? eleme.prefixo === authState.sessionData.prefixo
        : eleme.matricula === authState.sessionData.matricula, // Quando o escalão deferidor for por matricula, não utilizar o prefixo do usuario logado para verificação.
  );

  //Aqui são as options to input
  const filtroManifestacao = [
    constantes.acaoDeferir,
    constantes.acaoComplemento,
  ];
  const tiposManifestacoes = tipoManifestacao.filter((tipo) =>
    filtroManifestacao.includes(tipo.id),
  );

  const gravarDeferimento = (conteudoForm) => {
    const deferir = {
      idSolicitacao: pedidoFlex.id,
      ...conteudoForm,
    };
    inserirDeferimento(deferir)
      .then(() => {
        if (deferir?.parecer === '1') {
          message.success('Pedido Deferido.');
        } else {
          message.warn('Pedido indeferido.');
        }
        /*     dispatch(reloadUserPermissions()); */
        const naoPossuiPermissoesFlex = veriricarDeferimentosPendentes(perfil);
        if (naoPossuiPermissoesFlex) {
          history.push(`/`);
        } else {
          history.push(`/flex-criterios/`);
        }
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  const index = tiposManifestacoes.findIndex((obj) => {
    return obj.id === constantes.acaoComplemento;
  });

  tiposManifestacoes[index].descricao = 'Devolver para análise';

  return (
    <>
      <FormularioManifestacao
        titulo={isAnalise.titulo}
        exibirAcoes={isAnalise.exibirAcoes}
        exibirItensForm={isAnalise.exibirItensForm}
        analises={analisado}
        deferidos={deferido}
      />
      {faltaManifestar ? (
        <FormularioManifestacao
          enviarForm={gravarDeferimento}
          titulo={isDeferimento.titulo}
          exibirAcoes={isDeferimento.exibirAcoes}
          exibirItensForm={isDeferimento.exibirItensForm}
          manifestacoesAnteriores={manifestacoesAnteriores}
          mensagemErro={isDeferimento.mensagemErro}
          tiposManifestacoes={tiposManifestacoes}
        />
      ) : null}
      {/*   {!jaSeManifestou ? (
        <FormularioManifestacao
          enviarForm={gravarDeferimento}
          titulo={isDeferimento.titulo}
          exibirAcoes={isDeferimento.exibirAcoes}
          exibirItensForm={isDeferimento.exibirItensForm}
          manifestacoesAnteriores={manifestacoesAnteriores}
          mensagemErro={isDeferimento.mensagemErro}
          tiposManifestacoes={tiposManifestacoes}
        />
      ) : null} */}
    </>
  );
}

function veriricarDeferimentosPendentes(permissoes) {
  if (permissoes.length !== 2) {
    return false;
  }
  let ehDeferidor = false;
  let temApenasUmIdsPendenteDeferimento = false;

  for (const item of permissoes) {
    if (typeof item === 'string') {
      if (item === 'DEFERIDOR') {
        ehDeferidor = true;
      }
    } else if (typeof item === 'object' && item !== null) {
      if ('deferidor' in item) {
        const ids = item.deferidor;
        if (ids.length === 1) {
          temApenasUmIdsPendenteDeferimento = true;
        }
      }
    }
  }
  return ehDeferidor && temApenasUmIdsPendenteDeferimento;
}
