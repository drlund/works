import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { inserirManifestacao } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';
import history from 'history.js';
import {
  getManifestacoesAnteriores,
  possoMeManifestar,
} from 'pages/flexCriterios/helpers/funcoesAuxiliares';
import { useSelector } from 'react-redux';
import FormularioManifestacao from './formManifestarAnalisarDeferir';
import constantes from '../../helpers/constantes';
import FormularioComplementacao from './formComplementacao';
import { getComplementosPendentes } from '../../apiCalls/flexPedidosAPICall';

export default function Manifestacao({ tipoManifestacao, pedidoFlex, perfil }) {
  const authState = useSelector(({ app }) => app.authState);

  const possoManifestar = possoMeManifestar(
    pedidoFlex.manifestacoes,
    authState.sessionData,
    /* pedidoFlex?.isMyPendencia, */
  );

  //Se não estiver no zig zag o formulário não aparece
  if (!possoManifestar) {
    return null;
  }

  const [complementosPendentes, setComplementosPendentes] = useState([]);

  useEffect(() => {
    getComplementosPendentes(pedidoFlex.id, false)
      .then((resposta) => {
        setComplementosPendentes(resposta);
      })
      .catch((err) => console.log(err));
  }, []);

  const isManifestacao =
    (perfil.includes(constantes.perfilManifestante) ||
      perfil.includes(constantes.perfilRoot)) &&
    pedidoFlex?.etapa?.id === constantes.manifestar
      ? {
          titulo: ' Registrar Manifestação',
          exibirAcoes: true,
          exibirItensForm: true,
          mensagemErro: '',
        }
      : {
          titulo: 'Manifestação',
          exibirAcoes: false,
          exibirItensForm: false,
          mensagemErro: 'Existem manifestações pendentes.',
        };

  const manifestacoesAnteriores = getManifestacoesAnteriores(
    pedidoFlex?.manifestacoes,
  );

  const jaSeManifestou = pedidoFlex?.manifestacoes.find(
    (eleme) =>
      eleme.acao.id !== 1 &&
      eleme.situacao.id === 2 &&
      eleme.matricula === authState.sessionData.matricula,
  );

  const filtroManifestacao = [constantes.acaoComplemento];

  if (!jaSeManifestou) {
    filtroManifestacao.push(constantes.acaoManifestacao);
  }

  const tiposManifestacoes = tipoManifestacao.filter((tipo) =>
    filtroManifestacao.includes(tipo.id),
  );

  const filtroComplementacao = [constantes.acaoManifestacao];
  const tiposComplementacoes = tipoManifestacao.filter((tipo) =>
    filtroComplementacao.includes(tipo.id),
  );
  const gravarManifestacao = (conteudoForm, complementoId) => {
    const manifestacao = { idSolicitacao: pedidoFlex.id, ...conteudoForm };
    const idComplemento = complementoId || null;
    inserirManifestacao(manifestacao, idComplemento)
      .then(() => {
        if (manifestacao?.parecer === '1') {
          message.success('Parecer Registrado.');
        } else {
          message.warn('Pedido indeferido.');
        }
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  return (
    <>
      {complementosPendentes.length ? (
        complementosPendentes.map((complementoPendente) => (
          <FormularioComplementacao
            enviarForm={gravarManifestacao}
            titulo={'Complemento Pendente'}
            exibirAcoes={isManifestacao.exibirAcoes}
            exibirItensForm={isManifestacao.exibirItensForm}
            manifestacoesAnteriores={manifestacoesAnteriores}
            tiposManifestacoes={tiposComplementacoes}
            mensagemErro={isManifestacao.mensagemErro}
            complemento={complementoPendente}
          />
        ))
      ) : (
        <FormularioManifestacao
          enviarForm={gravarManifestacao}
          titulo={isManifestacao.titulo}
          exibirAcoes={isManifestacao.exibirAcoes}
          exibirItensForm={isManifestacao.exibirItensForm}
          manifestacoesAnteriores={manifestacoesAnteriores}
          tiposManifestacoes={tiposManifestacoes}
          mensagemErro={isManifestacao.mensagemErro}
        />
      )}
    </>
  );
}
