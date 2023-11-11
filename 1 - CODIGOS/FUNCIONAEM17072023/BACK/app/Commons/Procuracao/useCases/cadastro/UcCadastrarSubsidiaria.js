const exception = use("App/Exceptions/Handler");
const { REGEX_CEP, REGEX_CNPJ } = use("App/Commons/Regex");

class UcCadastrarSubsidiaria {
  constructor(subsidiariasRepository) {
    this.subsidiariasRepository = subsidiariasRepository;
    this.validated = false;
  }

  validate(dadosSubsidiaria) {
    const camposObrigatorios = [
      "nome",
      "nomeReduzido",
      "cnpj",
      "endereco",
      "complemento",
      "bairro",
      "cep",
      "municipio",
      "uf",
    ];

    for (const campoObrigatorio of camposObrigatorios) {
      if (!dadosSubsidiaria[campoObrigatorio]) {
        throw new exception(`Campo ${campoObrigatorio} é obrigatório!`, 400);
      }
    }

    if (!REGEX_CNPJ.test(dadosSubsidiaria.cnpj)) {
      throw new exception(`CNPJ com formato inválido.`, 400);
    }

    if (!REGEX_CEP.test(dadosSubsidiaria.cep)) {
      throw new exception(`CEP com formato inválido.`, 400);
    }

    this.validated = true;
    this.dadosSubsidiaria = dadosSubsidiaria;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }
    try {
      await this.subsidiariasRepository.cadastrarSubsidiaria({
        ...this.dadosSubsidiaria,
        ativo: 1,
      });
    } catch (error) {
      throw new exception(error, 500);
    }
  }
}

module.exports = UcCadastrarSubsidiaria;
