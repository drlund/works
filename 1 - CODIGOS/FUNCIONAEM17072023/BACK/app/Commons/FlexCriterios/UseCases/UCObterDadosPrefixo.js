"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

const { PREFIXO_REGEX } = require("../Constants");
const Prefixo = require("../Entidades/Prefixo");
const FuncisRegionais = require("../../../Models/Mysql/Arh/FuncisRegionais");
const JurisdicoesSubordinadas = require("../../../Models/Mysql/JurisdicoesSubordinadas");
const getAcessoExtra = require("../getAcessoExtra");

class UCObterDadosPrefixo extends AbstractUserCase {
  async _checks(prefixo, usuario) {
    if (!usuario) {
      throw new Error("Necesário estar logado.");
    }

    if (!prefixo) {
      throw new Error("Prefixo não informado.");
    }
    if (!PREFIXO_REGEX.test(prefixo)) {
      throw new Error("Prefixo informado no formato errado.");
    }

    const acessos = await getAcessoExtra(usuario);

    if (/ANALISTA|DESPACHANTE/.test(acessos?.permissoes)) {
      //Não verifica jurisdição
    } else {
      //Verifica Jurisdição
      const funciPrefixoVirtual = await FuncisRegionais.query()
        .where("matricula", usuario.matricula)
        .first();
      if (funciPrefixoVirtual) {
        usuario.prefixo = funciPrefixoVirtual.pref_gerev;
      }

      const juris = await JurisdicoesSubordinadas.query()
        .select("prefixo_subordinada")
        .where("prefixo", usuario.prefixo)
        .where("cd_subord_subordinada", "00")
        .distinct()
        .fetch();

      const jurisToJson = juris.toJSON();
      jurisToJson.push({
        prefixo_subordinada: `${usuario.prefixo}`,
      });

      const jurisSubordinada = await jurisToJson.find(
        (sub) => sub.prefixo_subordinada == prefixo
      );

      if (jurisSubordinada === (null || undefined)) {
        throw new Error(
          "Funcionário não tem jurisdição para incluir solicitações para o prefixo destino informado."
        );
      }
    }
  }
  async _action(prefixo) {
    const { arhMst, solicitacoes } = this.repository;
    let consulta = await arhMst.obterDadosPrefixo(prefixo);

    let resultado = Prefixo.transformPrefixoExibeSolicitacao(consulta);

    // resescreve a super pra todos e troca esse if pra se if diretoria nao alterar
    if (resultado?.prefixoDiretoria == "9600") {
      const results = await solicitacoes.substituiSuper(resultado.prefixo);
      if (results[0].nome) {
        resultado.prefixoSuper = results[0].prefixo;
        resultado.nomeSuper = results[0].nome;
      }
    }

    const diretoriasParteFerramenta =
      await solicitacoes.podeCriarSolicitacaoNasDiretoriasInformadas(
        resultado.prefixoDiretoria,
        resultado.prefixoDiretoria
      );

    if (diretoriasParteFerramenta === false) {
      this._throwExpectedError(
        "Diretoria do prefixo informado não faz parte das unidades alvo desta ferramenta.",
        400
      );
    }

    return resultado;
  }
}

module.exports = UCObterDadosPrefixo;
