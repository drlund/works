"use strict";
// const { AbstractUserCase } = use("App/Commons/AbstractUserCase");
const { AbstractUserCase } = require("../../AbstractUserCase");

class UCFindPermissoesUsuario extends AbstractUserCase {
  _checks({ dadosUsuario, token }) {
    if (!dadosUsuario) {
      throw new Error("Usuário não logado na Intranet.");
    }
    if (!token) {
      throw new Error("Token não fornecido.");
    }
  }

  async _action({ dadosUsuario, ESTADOS, token }) {
    const { concessoesAcessos } = this.repository;
    const {
      getListaComitesByMatricula,
      getAcessosExtras,
      CryptoJS,
      _,
    } = this.functions;

    // usa todos os tipos de identificadores disponiveis para acesso
    const listaIdentificadores = [
      dadosUsuario.chave,
      dadosUsuario.prefixo,
      dadosUsuario.uor,
      dadosUsuario.uor_trabalho,
      dadosUsuario.ref_org,
      dadosUsuario.nome_funcao,
      String(dadosUsuario.cod_funcao).padStart(6, "0"),
    ];

    // obtem a lista de comitês pela matrícula
    const listaComitesByMatricula = await getListaComitesByMatricula(
      dadosUsuario.chave
    );
    const listaComites = listaComitesByMatricula.map(
      (comite) => `C${comite.PREFIXO}`
    );
    listaIdentificadores.push(...listaComites);

    const concessoes = await concessoesAcessos.findConcessoesAtivas(
      listaIdentificadores
    );

    const permissoesReduced = concessoes.reduce((acc, cur) => {
      if (!acc[cur.ferramenta.nomeFerramenta]) {
        acc[cur.ferramenta.nomeFerramenta] = cur.permissoes;
      } else {
        acc[cur.ferramenta.nomeFerramenta].push(...cur.permissoes);
      }
      return acc;
    }, {});

    const listaPermissoes = Object.entries(permissoesReduced).map(
      ([key, val]) => ({
        ferramenta: key,
        permissoes: [...new Set(val)],
      })
    );

    const permissoesExtra = await getAcessosExtras(dadosUsuario);

    if (!_.isEmpty(permissoesExtra)) {
      // array conterá as ferramentas repetidas e as não incluídas na listaPermissoes
      const ferramRepet = !_.isEmpty(listaPermissoes)
        ? permissoesExtra.filter((item) =>
            listaPermissoes
              .map((perm) => perm.ferramenta)
              .includes(item.ferramenta)
          )
        : null;
      const ferramExtra = permissoesExtra.filter(
        (item) =>
          !listaPermissoes
            .map((perm) => perm.ferramenta)
            .includes(item.ferramenta)
      );

      // verificar se já existe ferramenta com o mesmo nome, para não repetir acesso
      if (!_.isEmpty(ferramRepet)) {
        // ? Se estiver na lista, faz um set com os dados das duas listas
        listaPermissoes.forEach((item) => {
          const [perm] = ferramRepet.filter(
            (it) => it.ferramenta === item.ferramenta
          );
          if (_.isEmpty(perm)) {
            return;
          }

          item.permissoes = [
            ...new Set([...perm.permissoes, ...item.permissoes]),
          ];
        });
      }

      if (!_.isEmpty(ferramExtra)) {
        listaPermissoes.push(...ferramExtra);
      }
    }

    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(listaPermissoes),
      token
    );

    return ciphertext;
  }
}

module.exports = UCFindPermissoesUsuario;
