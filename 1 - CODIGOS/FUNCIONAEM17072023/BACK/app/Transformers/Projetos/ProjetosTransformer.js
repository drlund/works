'use strict'
const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ProjetosTransformer class
 *
 * @class ProjetosTransformer
 * @constructor
 */
class ProjetosTransformer extends BumblebeeTransformer {
  // transforma o padrão do backend para o padrão frontend
  transform (projeto) {
    return {
     informacaoBasica: {
       id: projeto.id,
       idStatus: projeto.idStatus,
       titulo: projeto.titulo,
       tituloCheck: null,
       resumo: projeto.resumo,
       resumoCheck: null,
       objetivo: projeto.objetivo,
       objetivoCheck: null,
       qtdePessoas: projeto.qtdePessoas,
       qtdePessoasCheck: null,
       reducaoTempo: projeto.reducaoTempo,
       reducaoTempoCheck: null,
       reducaoCusto: projeto.reducaoCusto,
       reducaoCustoCheck: null,
      },
     responsaveis: projeto.responsaveis,
     funcionalidades: projeto.funcionalidades,
     anexosServidor: projeto.anexo,
     atividades: projeto.atividade,
     esclarecimentos: projeto.esclarecimento,
     listaComplexidades: projeto.listaComplexidades,
     listaPrioridades: projeto.listaPrioridades,
     listaStatus: projeto.listaStatus,
     listaTipos: projeto.listaTipos,
    }
  }

  // lista para a tela principal do app
  transformListaGeral (projeto) {
    return {
     id: projeto.id,
     titulo: projeto.titulo,
     responsavel: `${projeto.matriculaSolicitante} - ${projeto.responsavelData ? projeto.responsavelData.nome : 'Nome Indisponível'}`,
     dtAtualizacao: projeto.dtAtualizacao,
     idStatus: projeto.idStatus,
     descricaoStatus: projeto.status.descricao,
    }
  }

  // lista com andamento dos projetos
  transformListaAndamento (projeto) {
    projeto.responsavel.map(resp => {
      resp.codUorTrabalho = resp.responsavelData ? resp.responsavelData.uor_trabalho : null;
      delete resp.responsavelData;
      return resp;
    })

    projeto.funcionalidade.map( func => {
      return func.responsavel.map( resp => {
        resp.codUorTrabalho = resp.responsavelData ? resp.responsavelData.uor_trabalho : null;
        delete resp.responsavelData
        return resp
      })
    })

    return {
      id: projeto.id,
      titulo: projeto.titulo,
      idStatus: projeto.idStatus,
      descricaoStatus: projeto.status.descricao,
      funcionalidades: projeto.funcionalidade,
      responsaveis: projeto.responsavel,
    }
  }
}

module.exports = ProjetosTransformer
