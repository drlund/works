/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const foraAlcadaFuncionariosModel = use(
  "App/Models/Postgres/ForaAlcadaFuncionarios"
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const foraAlcadaPrefixosModel = use("App/Models/Postgres/ForaAlcadaPrefixos");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const foraAlcadaFuncionariosAnexosModel = use(
  "App/Models/Postgres/ForaAlcadaFuncionariosAnexos"
);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const foraAlcadaPrefixosAnexosModel = use(
  "App/Models/Postgres/ForaAlcadaPrefixosAnexos"
);

const salvarComplemento = {
  falhaProdutoServico: async (
    idMtn,
    listaPrefixos,
    dadosUsuario,
    idsAnexos,
    observacao,
    trx
  ) => {
    for (const prefixo of listaPrefixos) {
      const newPrefixoForaAlcada = new foraAlcadaPrefixosModel();
      newPrefixoForaAlcada.prefixo = prefixo.prefixo;
      newPrefixoForaAlcada.nome_prefixo = prefixo.nome;
      newPrefixoForaAlcada.matricula_inclusao = dadosUsuario.chave;
      newPrefixoForaAlcada.nome_inclusao = dadosUsuario.nome_usuario;
      newPrefixoForaAlcada.id_mtn = idMtn;
      newPrefixoForaAlcada.observacao = observacao;
      await newPrefixoForaAlcada.save(trx);

      for (const idAnexo of idsAnexos) {
        const foraAlcadaPrefixosAnexos = new foraAlcadaPrefixosAnexosModel();
        foraAlcadaPrefixosAnexos.id_anexo = idAnexo;
        foraAlcadaPrefixosAnexos.id_fora_alcada_prefixos =
          newPrefixoForaAlcada.id;
        await foraAlcadaPrefixosAnexos.save(trx);
      }
    }
  },

  envolvidoForaAlcance: async (
    idMtn,
    listaFuncionarios,
    dadosUsuario,
    idsAnexos,
    observacao,
    trx
  ) => {
    for (const funcionario of listaFuncionarios) {
      const newFuncionarioForaAlcada = new foraAlcadaFuncionariosModel();
      newFuncionarioForaAlcada.matricula_inclusao = dadosUsuario.chave;
      newFuncionarioForaAlcada.nome_inclusao = dadosUsuario.nome_usuario;
      newFuncionarioForaAlcada.matricula_fora_alcada = funcionario.matricula;
      newFuncionarioForaAlcada.nome_fora_alcada = funcionario.nome;
      newFuncionarioForaAlcada.id_mtn = idMtn;
      newFuncionarioForaAlcada.observacao = observacao;
      await newFuncionarioForaAlcada.save(trx);
      for (const idAnexo of idsAnexos) {
        const foraAlcadaFuncionariosAnexos = new foraAlcadaFuncionariosAnexosModel();
        foraAlcadaFuncionariosAnexos.id_anexo = idAnexo;
        foraAlcadaFuncionariosAnexos.id_fora_alcada_funcionarios =
          newFuncionarioForaAlcada.id;
        await foraAlcadaFuncionariosAnexos.save(trx);
      }
    }
  },
};

/**
 *
 *  Função para salvar o complemento do fechamento do MTN sem envolvido.
 *
 *  @param tipoComplemento Podem ser de dois tipos: envolvidoForaAlcance ou falhaProdutoServico
 *  @param idMtn
 *  @param dadosComplemento
 *  @param dadosUsuario
 *  @param trx
 *
 */

const salvarComplementoForaDeAlcance = async (
  tipoComplemento,
  idMtn,
  dadosComplemento,
  dadosUsuario,
  idsAnexos,
  trx
) => {
  await salvarComplemento[tipoComplemento](
    idMtn,
    dadosComplemento,
    dadosUsuario,
    idsAnexos,
    trx
  );
};

module.exports = salvarComplementoForaDeAlcance;
