import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  getComplementosPendentes,
  inserirAnalise,
  inserirManifestacao,
} from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import history from 'history.js';
import { getManifestacoesAnteriores } from 'pages/flexCriterios/helpers/funcoesAuxiliares';
import FormularioManifestacao from './formManifestarAnalisarDeferir';
import constantes from '../../helpers/constantes';
import FormularioComplementacao from './formComplementacao';

export default function Analise({ tipoManifestacao, pedidoFlex, perfil }) {
  const [complementosPendentes, setComplementosPendentes] = useState([]);

  useEffect(() => {
    getComplementosPendentes(pedidoFlex.id, true)
      .then((resposta) => {
        setComplementosPendentes(resposta);
      })
      .catch((err) => console.log(err));
  }, []);

  const isAnalise =
    (perfil.includes(constantes.perfilAnalista) ||
      perfil.includes(constantes.perfilDeferidor) ||
      perfil.includes(constantes.perfilRoot)) &&
    pedidoFlex?.etapa?.id === constantes.analisar
      ? {
          titulo: 'Análise',
          exibirAcoes: true,
          exibirItensForm: true,
          mensagemErro: '',
        }
      : {
          titulo: 'Análise',
          exibirAcoes: false,
          exibirItensForm: false,
          mensagemErro:
            pedidoFlex?.etapa?.id < constantes.analisar
              ? 'Existem Manifestações pendentes.'
              : 'Pendente de Análise.',
        };

  const analisado = pedidoFlex?.manifestacoes?.filter(
    (manifestacao) => manifestacao.acao.id === constantes.analisar,
  );

  const manifestacoesAnteriores = getManifestacoesAnteriores(
    pedidoFlex?.manifestacoes,
  );

  const filtroManifestacao = [
    constantes.acaoAnalise,
    constantes.acaoComplemento,
  ];
  const tiposManifestacoes = tipoManifestacao.filter((tipo) =>
    filtroManifestacao.includes(tipo.id),
  );

  const gravarAnalise = (conteudoForm) => {
    const analise = { idSolicitacao: pedidoFlex.id, ...conteudoForm };
    inserirAnalise(analise)
      .then(() => {
        message.success('Análise Registrada.');
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  const filtroComplementacao = [constantes.acaoManifestacao];
  const tiposComplementacoes = tipoManifestacao.filter((tipo) =>
    filtroComplementacao.includes(tipo.id),
  );

  const gravarComplementacao = (conteudoForm, complementoId) => {
    const manifestacao = { idSolicitacao: pedidoFlex.id, ...conteudoForm };
    const idComplemento = complementoId || null;
    inserirManifestacao(manifestacao, idComplemento)
      .then(() => {
        message.success('Parecer Registrado.');
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  return (
    <>
      {complementosPendentes?.map((complementoPendente) => (
        <FormularioComplementacao
          enviarForm={gravarComplementacao}
          titulo={'Complemento Pendente'}
          exibirAcoes={true}
          exibirItensForm={true}
          manifestacoesAnteriores={manifestacoesAnteriores}
          mensagemErro={''}
          tiposManifestacoes={tiposComplementacoes}
          complemento={complementoPendente}
        />
      ))}

      <FormularioManifestacao
        enviarForm={gravarAnalise}
        titulo={isAnalise.titulo}
        exibirAcoes={isAnalise.exibirAcoes}
        exibirItensForm={isAnalise.exibirItensForm}
        analises={analisado}
        manifestacoesAnteriores={manifestacoesAnteriores}
        mensagemErro={isAnalise.mensagemErro}
        tiposManifestacoes={tiposManifestacoes}
      />
    </>
  );
}
