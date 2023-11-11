import React from 'react';
import { message } from 'antd';
import { inserirFinalizacao } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import history from 'history.js';
import FormularioManifestacao from './formManifestarAnalisarDeferir';
import constantes from '../../helpers/constantes';
import { getManifestacoesAnteriores } from 'pages/flexCriterios/helpers/funcoesAuxiliares';

export default function Finalizar({ tipoManifestacao, pedidoFlex, perfil }) {
  const isAnalise = pedidoFlex?.etapa?.id === constantes.finalizar && {
    titulo: 'Análise',
    exibirAcoes: false,
    exibirItensForm: false,
    mensagemErro: '',
  };
  const isDeferir = pedidoFlex?.etapa?.id === constantes.finalizar && {
    titulo: 'Deferimento',
    exibirAcoes: false,
    exibirItensForm: false,
    mensagemErro: '',
  };
  const isFinalizacao =
    (perfil.includes(constantes.perfilExecutante) ||
      perfil.includes(constantes.perfilRoot)) &&
    pedidoFlex?.etapa?.id === constantes.finalizar
      ? {
          titulo: 'Finalizar',
          exibirAcoes: true,
          exibirItensForm: true,
          mensagemErro: '',
        }
      : {
          titulo: 'Finalizar',
          exibirAcoes: false,
          exibirItensForm: false,
          mensagemErro:
            pedidoFlex?.etapa?.id < constantes.finalizar
              ? 'Existem Despachos pendentes.'
              : 'Solicitação finalizada.',
        };

  const analisado = pedidoFlex?.manifestacoes?.filter(
    (manifestacao) => manifestacao.acao.id === constantes.analisar,
  );
  const deferido = pedidoFlex?.manifestacoes?.filter(
    (manifestacao) => manifestacao.acao.id === constantes.deferir,
  );
  const manifestacoesAnteriores = getManifestacoesAnteriores(
    pedidoFlex?.manifestacoes,
  );

  const filtroManifestacao = [
    constantes.acaoFinalizar,
    constantes.acaoComplemento,
  ];
  const tiposManifestacoes = tipoManifestacao.filter((tipo) =>
    filtroManifestacao.includes(tipo.id),
  );

  const gravarFinalizacao = (conteudoForm) => {
    const finalizar = { idSolicitacao: pedidoFlex.id, ...conteudoForm };
    inserirFinalizacao(finalizar)
      .then(() => {
        if (finalizar.idAcao == constantes.acaoComplemento) {
          message.success('Pedido devolvido para análise com sucesso.');
        } else if (finalizar?.parecer === '1') {
            message.success('Pedido Finalizado.');
          } else {
            message.warn('Pedido indeferido.');
          }

        history.push(`/flex-criterios/`);
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
      />
      <FormularioManifestacao
        titulo={isDeferir.titulo}
        exibirAcoes={isDeferir.exibirAcoes}
        exibirItensForm={isDeferir.exibirItensForm}
        analises={deferido}
      />
      <FormularioManifestacao
        enviarForm={gravarFinalizacao}
        titulo={isFinalizacao.titulo}
        exibirAcoes={isFinalizacao.exibirAcoes}
        exibirItensForm={isFinalizacao.exibirItensForm}
        manifestacoesAnteriores={manifestacoesAnteriores}
        mensagemErro={isFinalizacao.mensagemErro}
        tiposManifestacoes={tiposManifestacoes}
      />
    </>
  );
}
