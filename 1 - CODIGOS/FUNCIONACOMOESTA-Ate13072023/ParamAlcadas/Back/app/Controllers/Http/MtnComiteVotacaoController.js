"use strict";

const ComiteVotacaoRepository = use("App/Commons/Mtn/ComiteMtn/ComiteVotacaoRepository");
const ComiteVotacaoService = use("App/Commons/Mtn/ComiteMtn/ComiteVotacao/ComiteVotacaoService");
const exception = use("App/Exceptions/Handler");
const moment = use('App/Commons/MomentZoneBR');

class MtnComiteVotacaoController {
  constructor() {
    this.comiteVotacaoRepository = new ComiteVotacaoRepository();
    this.comiteVotacaoService = new ComiteVotacaoService({ comiteVotacaoRepository: this.comiteVotacaoRepository });
  }

  async getComiteVotacao() {
    return this.comiteVotacaoService.getComiteVotacao();
  }

  async incluirMembroComite({ request }) {
    const { matricula, dataExpiracao: data_expiracao } = request.all();
    this._verificaMatricula(matricula);
    this._verificaDataExpiracao(data_expiracao);

    return this.comiteVotacaoService.incluirMembroComite({
      matricula: matricula.toUpperCase(),
      data_expiracao: data_expiracao || this._oneYearFromNow(),
    });
  }

  async alterarMembroComite({ request, response }) {
    const { matricula, dataExpiracao: data_expiracao } = request.all();
    this._verificaMatricula(matricula);
    this._verificaDataExpiracao(data_expiracao);

    await this.comiteVotacaoService.alterarMembroComite({
      matricula: matricula.toUpperCase(),
      data_expiracao: data_expiracao || this._oneYearFromNow(),
    });
    response.status(200).send();
  }

  async excluirMembroComite({ request, response }) {
    const { matricula } = request.all();
    this._verificaMatricula(matricula);

    await this.comiteVotacaoService.excluirMembroComite({ matricula: matricula.toUpperCase() });
    response.status(204).send();
  }

  _verificaMatricula(matricula) {
    if (!matriculaEhValida())
      throw new exception("Matricula não informada ou com formato inválido.", 400);

    function matriculaEhValida() {
      const matriculaRegex = /^[a-z]\d{7}$/i;
      if (matriculaRegex.test(matricula)) {
        return true;
      }
      return false;
    }
  }

  _verificaDataExpiracao(data_expiracao) {
    if (!data_expiracao) return;

    if (
      moment(data_expiracao).isAfter(this._oneYearFromNow(), 'day') ||
      moment(data_expiracao).isBefore(moment(), 'day') ||
      !moment(data_expiracao).isValid()
    ) {
      throw new exception("Data de expiração inválida.", 400);
    }
  }

  _oneYearFromNow() {
    return moment().add(1, "year").format("YYYY-MM-DD");
  }
}

module.exports = MtnComiteVotacaoController;
