const { round } = require("../../NumberUtils");
const { SITUACOES } = require("../Constants");
const { transformFunciEnvolvido } = require("../Entidades/Funci");
const { transformGetManifestacoes } = require("../Entidades/Manifestacao");

class Solicitacao {
  static listarSolicitacoes(lista) {
    const solicitacoes = lista.map((item) => {
      return {
        id: String(item.id),
        comissaoOrigem: item.funcao,
        nomeComissaoOrigem: item.nomeFuncao,
        clarosOrigem: item.clarosOrigem,
        comissaoDestino: item.funcaoPretendida,
        nomeComissaoDestino: item.nomeFuncaoPretendida,
        clarosDestino: item.clarosDestino,
        tipo: item.tipos,
        status: item.status.nome,
        localizacao: item.localizacao.nome,
        etapa: item.etapa,
        analise: item.analise,
        funcionario: `${item.funci.matricula} - ${item.funci.nome}`,
        origem: `${item.prefixoOrig.prefixo} - ${item.prefixoOrig.nome}`,
        destino: `${item.prefixoDest.prefixo} - ${item.prefixoDest.nome}`,
      };
    });

    return solicitacoes;
  }

  static transformInserirSolicitacao(dadosSolicitacao) {
    return {
      matricula: dadosSolicitacao.matricula,
      nome: dadosSolicitacao.nome,
      funcao: String(dadosSolicitacao.funcaoLotacao).padStart(5, "0"),
      nomeFuncao: dadosSolicitacao.descricaoCargo,
      prefixoOrigem: String(dadosSolicitacao.prefixoOrigem.prefixo).padStart(
        4,
        "0"
      ),
      nomePrefixoOrigem: dadosSolicitacao.prefixoOrigem.nome,
      gerevOrigem: String(dadosSolicitacao.prefixoOrigem.prefixoGerev).padStart(
        4,
        "0"
      ),
      nomeGerevOrigem: dadosSolicitacao.prefixoOrigem.nomeGerev,
      superOrigem: String(dadosSolicitacao.prefixoOrigem.prefixoSuper).padStart(
        4,
        "0"
      ),
      nomeSuperOrigem: dadosSolicitacao.prefixoOrigem.nomeSuper,
      diretoriaOrigem: String(
        dadosSolicitacao.prefixoOrigem.prefixoDiretoria
      ).padStart(4, "0"),
      nomeDiretoriaOrigem: dadosSolicitacao.prefixoOrigem.nomeDiretoria,
      clarosOrigem: round(
        parseFloat(
          String(dadosSolicitacao.prefixoOrigem.clarosOrigem)
            .replace(",", ".")
            .replace("%", "")
        ),
        1
      ),
      oportunidade: dadosSolicitacao?.oportunidade ?? null,
      funcaoPretendida: String(dadosSolicitacao.funcaoPretendida).padStart(
        5,
        "0"
      ),
      nomeFuncaoPretendida: dadosSolicitacao.nomeFuncaoPretendida,
      prefixoDestino: String(dadosSolicitacao.prefixoDestino.prefixo).padStart(
        4,
        "0"
      ),
      nomePrefixoDestino: dadosSolicitacao.prefixoDestino.nome,
      gerevDestino: String(
        dadosSolicitacao.prefixoDestino.prefixoGerev
      ).padStart(4, "0"),
      nomeGerevDestino: dadosSolicitacao.prefixoDestino.nomeGerev,
      superDestino: String(
        dadosSolicitacao.prefixoDestino.prefixoSuper
      ).padStart(4, "0"),
      nomeSuperDestino: dadosSolicitacao.prefixoDestino.nomeSuper,
      diretoriaDestino: String(
        dadosSolicitacao.prefixoDestino.prefixoDiretoria
      ).padStart(4, "0"),
      nomeDiretoriaDestino: dadosSolicitacao.prefixoDestino.nomeDiretoria,
      clarosDestino: round(
        parseFloat(
          String(dadosSolicitacao.prefixoDestino.clarosDestino)
            .replace(",", ".")
            .replace("%", "")
        ),
        1
      ),
      matriculaSolicitante: dadosSolicitacao.usuario.chave,
      nomeSolicitante: dadosSolicitacao.usuario.nome_usuario,
    };
  }

  static transformInserirManifestacao(dadosManifestacao) {
    return {
      texto: dadosManifestacao.justificativa,
      matricula: dadosManifestacao.usuario.chave,
      nome: dadosManifestacao.usuario.nome_usuario,
      funcao: dadosManifestacao.usuario.cod_funcao,
      nomeFuncao: dadosManifestacao.usuario.nome_funcao,
      prefixo: dadosManifestacao.usuario.prefixo,
      nomePrefixo: dadosManifestacao.usuario.dependencia,
    };
  }

  static transformEditarManifestacao(dadosManifestacao) {
    return {
      parecer: dadosManifestacao.parecer,
      texto: dadosManifestacao.justificativa,
      matricula: dadosManifestacao.usuario.chave,
      nome: dadosManifestacao.usuario.nome_usuario,
    };
  }

  static transformInserirJustificativa(dadosManifestacao) {
    return {
      id_solicitacao: dadosManifestacao.id_solicitacao,
      id_acao: dadosManifestacao.id_acao,
      id_situacao: SITUACOES.REGISTRADA,
      texto: dadosManifestacao.justificativa,
      matricula: dadosManifestacao.usuario.chave,
      nome: dadosManifestacao.usuario.nome_usuario,
      funcao: dadosManifestacao.usuario.cod_funcao,
      nomeFuncao: dadosManifestacao.usuario.nome_funcao,
      prefixo: dadosManifestacao.usuario.prefixo,
      nomePrefixo: dadosManifestacao.usuario.dependencia,
      ordemManifestacao: dadosManifestacao.ordemManifestacao,
      parecer: dadosManifestacao.parecer,
    };
  }

  static transformDetalharSolicitacao(dadosSolicitacao) {
    const analise = JSON.parse(dadosSolicitacao.analise.validacaoRH);

    return {
      id: dadosSolicitacao.id,
      anexos: dadosSolicitacao.anexos,
      status: {
        id: dadosSolicitacao.status.id,
        nome: dadosSolicitacao.status.nome,
      },
      localizacao: {
        id: dadosSolicitacao.localizacao.id,
        nome: dadosSolicitacao.localizacao.nome,
      },
      etapa: {
        id: dadosSolicitacao.etapa.id,
        nome: dadosSolicitacao.etapa.nome,
        sequencial: dadosSolicitacao.etapa.sequencial,
      },
      manifestacoes: transformGetManifestacoes(dadosSolicitacao.manifestacoes),
      funcionarioEnvolvido: {
        ...transformFunciEnvolvido(dadosSolicitacao),
        analise,
      },
      tiposSolicitacao: dadosSolicitacao.tipos,
      matriculaSolicitante: dadosSolicitacao.matriculaSolicitante,
      nomeSolicitante: dadosSolicitacao.nomeSolicitante,
    };
  }

  static transformNovaAnalise(dados) {
    return {
      idSolicitacao: dados.id,
      dadosOrigem: JSON.stringify({
        prefixoDiretoria: dados.prefixoOrigem.prefixoDiretoria,
        nomeDiretoria: dados.prefixoOrigem.nomeDiretoria,
        clarosOrigem: dados.clarosOrigem,
        clarosOrigemDepois: dados.clarosOrigemDepois,
        gfmFunciOrigem: dados.gfmFunciOrigem,
      }),
      dadosDestino: JSON.stringify({
        prefixoDiretoria: dados.prefixoDestino.prefixoDiretoria,
        nomeDiretoria: dados.prefixoDestino.nomeDiretoria,
        clarosDestino: dados.clarosDestino,
      }),
      validacaoRH: JSON.stringify({
        ...dados.analise,
        impedimentoInstitucionalRelacional:
          dados.impedimentoInstitucionalRelacional,
      }),
    };
  }
}

module.exports = Solicitacao;
