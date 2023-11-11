"use strict";
const { AbstractUserCase } = use("App/Commons/AbstractUserCase");

class UCSaveConcessaoAcesso extends AbstractUserCase {
  async _checks({ params, nome, chave }) {
    if (!nome || !chave) {
      this._throwExpectedError(
        "Não foi possível verificar as credenciais do funcionário logado."
      );
    }

    const { validate } = this.functions;
    const schema = {
      id: "string",
      tipo: "string",
      identificador: "required|string",
      permissoes: "array|min:1",
      idFerramenta: "required|string",
      validade: "string",
    };

    const { id, permissoes, idFerramenta, tipo, identificador } = params;

    const validation = await validate(
      {
        id,
        tipo,
        identificador,
        permissoes,
        idFerramenta,
      },
      schema
    );

    if (validation.fails()) {
      this._throwExpectedError(
        "Função salvar ferramenta não recebeu todos os parâmetros obrigatórios!"
      );
    }
  }

  async _action({ params, chave, nome }) {
    const { concessoesAcessos } = this.repository;
    const {
      ObjectId,
      moment,
      replaceVariable,
      REGEX_ACESSO,
      ESTADOS,
      MENSAGENS_LOG,
      getOneFunci,
      DATABASE_DATETIME_OUTPUT,
    } = this.functions;

    const { id, permissoes, idFerramenta } = params;
    let { tipo, identificador, validade } = params;

    tipo = ObjectId(tipo);

    const dadosMensagem = [
      moment().format(DATABASE_DATETIME_OUTPUT),
      chave,
      nome,
    ];

    validade = ![undefined, null].includes(validade)
      ? moment(validade).startOf("day").add(12, "hours")
      : "";

    const mensagem = replaceVariable(MENSAGENS_LOG.NOVO, dadosMensagem);
    let concessoes;

    const payloadData = {
      identificador: String(identificador).toUpperCase(),
      permissoes,
      ferramenta: idFerramenta,
      matricula: chave,
      tipo,
      ativo: ESTADOS.ATIVO,
      log: [mensagem],
      validade,
    };

    if (REGEX_ACESSO.MATRICULAS.test(identificador)) {
      try {
        const consulta = await getOneFunci(identificador);

        payloadData.prefixo = consulta.agenciaLocalizacao;
      } catch {
        this._throwExpectedError(
          "Não foi possível determinar a ag. de localização do funci informado"
        );
      }
    }

    const jaCadastrado = await concessoesAcessos.localizarUm({
      identificador,
      ferramenta: idFerramenta,
    });

    if (!id) {
      //verifica se ja possui alguma ferramenta cadastrada para este indentificador

      if (jaCadastrado?.ativo == 0) {
        this._throwExpectedError(
          'Já existe um acesso para este usuario e esta ferramenta na aba "inativos" !'
        );
      }

      if (jaCadastrado) {
        this._throwExpectedError(
          "Já existe uma ferramenta cadastrada para este identificador!"
        );
      }

      concessoes = await concessoesAcessos.inserir(payloadData);
    } else {
      const update = {
        $set: {
          permissoes,
          validade,
          ativo: ESTADOS.ATIVO,
          prefixo: payloadData?.prefixo,
        },
        $push: {
          log: replaceVariable(MENSAGENS_LOG.ATUALIZACAO, dadosMensagem),
        },
      };
      concessoes = await concessoesAcessos.atualizarPorId({ id, update });
    }

    return { id: concessoes.id };
  }
}

module.exports = UCSaveConcessaoAcesso;
