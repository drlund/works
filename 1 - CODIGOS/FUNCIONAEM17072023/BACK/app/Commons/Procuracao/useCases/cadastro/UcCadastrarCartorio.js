const exception = use("App/Exceptions/Handler");
const { REGEX_CEP, REGEX_CNPJ } = use("App/Commons/Regex");

class UcCadastrarCartorio {
  constructor(cartoriosRepository) {
    this.cartoriosRepository = cartoriosRepository;
    this.validated = false;
  }

  validate(dadosCartorio) {
    const camposObrigatorios = [
      "nome",
      "cnpj",
      "endereco",
      "complemento",
      "bairro",
      "cep",
      "municipio",
      "uf",
    ];

    for (const campoObrigatorio of camposObrigatorios) {
      if (!dadosCartorio[campoObrigatorio]) {
        throw new exception(`Campo ${campoObrigatorio} é obrigatório!`, 400);
      }
    }

    if (!REGEX_CNPJ.test(dadosCartorio.cnpj)) {
      throw new exception(`CNPJ com formato inválido.`, 400);
    }

    if (!REGEX_CEP.test(dadosCartorio.cep)) {
      throw new exception(`CEP com formato inválido.`, 400);
    }

    this.validated = true;
    this.dadosCartorio = dadosCartorio;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }
    try {
      await this.cartoriosRepository.cadastrarCartorio({
        ...this.dadosCartorio,
        ativo: 1,
      });
    } catch (error) {
      throw new exception(error, 500);
    }
  }
}

module.exports = UcCadastrarCartorio;
