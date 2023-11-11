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

  const isAnalise = {
    titulo: 'Análise',
    exibirAcoes: true,
    exibirItensForm: true,
    mensagemErro: '',
  };

  /** @type {{ gestorUnidadeAlvo: string[] }} */
  const foundGestorUnidadeAlvo = perfil.find(
    (/** @type {{ gestorUnidadeAlvo: string[] }} */ p) => p?.gestorUnidadeAlvo,
  );
  const gestorUnidadeAlvo = foundGestorUnidadeAlvo?.gestorUnidadeAlvo || [];
  const isGestorDestino = gestorUnidadeAlvo.includes(
    pedidoFlex.funcionarioEnvolvido.prefixoDestino.prefixoDiretoria,
  );

  const analisesRegistradas = pedidoFlex?.manifestacoes?.filter(
    (manifestacao) => manifestacao.acao.id === constantes.analisar,
  );
  const manifestacoesAnteriores = getManifestacoesAnteriores(
    pedidoFlex?.manifestacoes,
  );

  // Filtros para o formulário do analisar
  const filtroManifestacao = [
    constantes.acaoAnalise,
    constantes.acaoComplemento,
  ];
  const tiposManifestacoes = tipoManifestacao.filter((tipo) =>
    filtroManifestacao.includes(tipo.id),
  );

  const filtroComplementacao = [constantes.acaoManifestacao];
  const tiposComplementacoes = tipoManifestacao.filter((tipo) =>
    filtroComplementacao.includes(tipo.id),
  );

  //Chamadas API
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

  const gravarAnalise = (conteudoForm) => {
    const analise = { idSolicitacao: pedidoFlex.id, ...conteudoForm };
    inserirAnalise(analise)
      .then(() => {
        if (analise?.idAcao == 9) {
          message.success('Pedido de complementação incluido com sucesso.');
          history.push(`/flex-criterios/`);
          return;
        }

        if (analise?.parecer === '1') {
          message.success('Análise Registrada.');
        } else {
          message.warn('Análise indeferida.');
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
        complementosPendentes?.map((complementoPendente) => (
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
        ))
      ) : (
        <FormularioManifestacao
          enviarForm={gravarAnalise}
          titulo={isAnalise.titulo}
          exibirAcoes={isAnalise.exibirAcoes && isGestorDestino}
          exibirItensForm={isAnalise.exibirItensForm && isGestorDestino}
          analises={analisesRegistradas}
          manifestacoesAnteriores={manifestacoesAnteriores}
          mensagemErro={isAnalise.mensagemErro}
          tiposManifestacoes={tiposManifestacoes}
        />
      )}
    </>
  );
}
