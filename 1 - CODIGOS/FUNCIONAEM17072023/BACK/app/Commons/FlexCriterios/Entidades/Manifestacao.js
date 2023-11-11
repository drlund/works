const { SITUACOES, OPTS_STR, ACOES, ESCALOES } = require("../Constants");

module.exports = class Manifestacao {
  static transformNovaManifestacao(dados) {
    return {
      id_solicitacao: dados.id_solicitacao,
      id_acao: dados.id_acao,
      texto: dados.texto,
      codFunci: dados.codFunci,
      nomeFunci: dados.nomeFunci,
      codFuncao: dados.codFuncao,
      nomeFuncao: dados.nomeFuncao,
      codPrefixo: dados.codPrefixo,
      nomePrefixo: dados.nomePrefixo,
      ordemManifestacao: dados.ordemManifestacao,
    };
  }

  static transformGetManifestacoes(manifestacoes) {
    const resultado = manifestacoes.map((item) => ({
      id: item.id,
      idSolicitacao: item.id_solicitacao,
      id_escalao: item.id_escalao, // inclusão da informação de id_escalão para tratamento no front
      acao: {
        id: item.acao.id,
        nome: item.acao.nome,
      },
      situacao: {
        id: item.situacao.id,
        nome: item.situacao.nome,
      },
      ordemManifestacao: item.ordemManifestacao,
      parecer: item.parecer,
      texto: item.texto,
      matricula: item.matricula,
      nome: item.nome,
      funcao: item.funcao,
      nomeFuncao: item.nomeFuncao,
      prefixo: item.prefixo,
      nomePrefixo: item.nomePrefixo,
      updatedAt: item.updatedAt,
      complementoEsperado: item.complementoEsperado,
      matComplemento: item.matSolicitanteComplemento,
    }));

    return resultado;
  }

  static transformEditarManifestacao(dadosManifestacao) {
    return {
      id_solicitacao: dadosManifestacao.idSolicitacao,
      id_situacao: SITUACOES.REGISTRADA,
      parecer: dadosManifestacao.parecer,
      texto: dadosManifestacao.texto,
      matricula: dadosManifestacao.usuario.chave,
      nome: dadosManifestacao.usuario.nome_usuario,
    };
  }

  static transformNovaManifestacaoDesfavoravel(dadosManifestacao) {
    return {
      id_solicitacao: dadosManifestacao.idSolicitacao,
      id_situacao: SITUACOES.REGISTRADA,
      parecer: OPTS_STR.NAO,
      texto: dadosManifestacao.texto,
      matricula: dadosManifestacao.usuario.chave,
      nome: dadosManifestacao.usuario.nome_usuario,
    };
  }

  static transformNovaAnalise(dados) {
    return {
      id_solicitacao: dados.idSolicitacao,
      id_acao: ACOES.ANALISE,
      parecer: dados.parecer,
      texto: dados.texto,
      matricula: dados.usuario.chave,
      nome: dados.usuario.nome_usuario,
      funcao: String(dados.usuario.cod_funcao).padStart(5, "0"),
      nomeFuncao: dados.usuario.nome_funcao,
      prefixo: dados.usuario.prefixo,
      nomePrefixo: dados.usuario.dependencia,
    };
  }

  static transformNovoDespacho(dados) {
    return {
      id_solicitacao: dados.idSolicitacao,
      id_acao: ACOES.DESPACHO,
      id_situacao: SITUACOES.REGISTRADA,
      parecer: OPTS_STR.SIM,
      texto: `Escalão Deferidor definido no despacho:\n
        - Diretoria: ${dados.diretoria[0]} - ${dados.diretoria[1]}\n
        - Escalão: ${ESCALOES[dados.idEscalao]}
      `,
      matricula: dados?.matricula ?? null,
      nome: dados?.nome ?? null,
      funcao: dados?.funcao ?? null,
      nomeFuncao: dados?.nomeFuncao ?? null,
      prefixo: dados.diretoria[0],
      nomePrefixo: dados.diretoria[1],
    };
  }

  static transformNovoDeferimento(dados) {
    return {
      id_solicitacao: dados.idSolicitacao,
      id_acao: ACOES.DEFERIMENTO,
      id_situacao: SITUACOES.REGISTRADA,
      parecer: dados.parecer,
      texto: dados.texto,
      matricula: dados.usuario.chave,
      nome: dados.usuario.nome_usuario,
      funcao: String(dados.usuario.cod_funcao).padStart(5, "0"),
      nomeFuncao: dados.usuario.nome_funcao,
      // prefixo: dados.usuario.prefixo,  Retorno de informações estavam realizando update no DB quando escalão por matricula, gerando bug.
      // nomePrefixo: dados.usuario.dependencia,
    };
  }

  static transformNovaFinalizacao(dados) {
    return {
      id_solicitacao: dados.idSolicitacao,
      id_acao: ACOES.FINALIZACAO,
      id_situacao: SITUACOES.REGISTRADA,
      parecer: dados.parecer,
      texto: dados.texto,
      matricula: dados.usuario.chave ?? null,
      nome: dados.usuario.nome_usuario ?? null,
      funcao: dados.usuario.cod_funcao ?? null,
      nomeFuncao: dados.usuario.nome_funcao ?? null,
      prefixo: dados.usuario.prefixo,
      nomePrefixo: dados.usuario.dependencia,
    };
  }
};
