"use strict";
const AtividadeComplexidade = use("App/Models/Mysql/Projetos/AtividadeComplexidade.js");
const AtividadePrioridade = use("App/Models/Mysql/Projetos/AtividadePrioridade.js");
const AtividadeFuncionalidadeProjetoStatus = use("App/Models/Mysql/Projetos/AtividadeFuncionalidadeProjetoStatus.js");
const AtividadeFuncionalidadeTipo = use("App/Models/Mysql/Projetos/AtividadeFuncionalidadeTipo.js");
const ADBaseCorporativa = use("App/Models/Mysql/Projetos/ADBaseCorporativa.js");
const ADClassificacao = use("App/Models/Mysql/Projetos/ADClassificacao.js");
const ADConformidade = use("App/Models/Mysql/Projetos/ADConformidade.js");
const ADDadosPF = use("App/Models/Mysql/Projetos/ADDadosPF.js");
const ADDadosTempoGuarda = use("App/Models/Mysql/Projetos/ADDadosTempoGuarda.js");
const ADListaProspeccao = use("App/Models/Mysql/Projetos/ADListaProspeccao.js");
const ADOrigemDado = use("App/Models/Mysql/Projetos/ADOrigemDado.js");
const ADTipoDado = use("App/Models/Mysql/Projetos/ADTipoDado.js");
const ADUsuarioComum = use("App/Models/Mysql/Projetos/ADUsuarioComum.js");
const ADUsuarioExecutante = use("App/Models/Mysql/Projetos/ADUsuarioExecutante.js");
const ADUsuarioLocalizacao = use("App/Models/Mysql/Projetos/ADUsuarioLocalizacao.js");
const ADUsuarioTipo = use("App/Models/Mysql/Projetos/ADUsuarioTipo.js");

const getListaOpcoes = async (nomeLista) => {
  let lista;
  switch (nomeLista) {
    case 'complexidade':
      lista = await AtividadeComplexidade.all();
    break;

    case 'prioridade':
      lista = await AtividadePrioridade.all();
    break;

    case 'status':
      lista = await AtividadeFuncionalidadeProjetoStatus.all();
    break;

    case 'tipo':
      lista = await AtividadeFuncionalidadeTipo.all();
    break;

    case 'baseCorporativa':
      lista = await ADBaseCorporativa.all();
    break;

    case 'classificacao':
      lista = await ADClassificacao.all();
    break;

    case 'conformidade':
      lista = await ADConformidade.all();
    break;

    case 'dadosPF':
      lista = await ADDadosPF.all();
    break;

    case 'tempoGuarda':
      lista = await ADDadosTempoGuarda.all();
    break;

    case 'listaProspeccao':
      lista = await ADListaProspeccao.all();
    break;

    case 'origemDado':
      lista = await ADOrigemDado.all();
    break;

    case 'tipoDado':
      lista = await ADTipoDado.all();
    break;

    case 'usuarioComum':
      lista = await ADUsuarioComum.all();
    break;

    case 'usuarioExecutante':
      lista = await ADUsuarioExecutante.all();
    break;

    case 'usuarioLocalizacao':
      lista = await ADUsuarioLocalizacao.all();
    break;

    case 'usuarioTipo':
      lista = await ADUsuarioTipo.all();
    break;

    default:
      lista = await AtividadeFuncionalidadeTipo.all();
    break;
  }

  return lista;
}

module.exports = getListaOpcoes;