"use strict";

const { AbstractUserCase } = require('../../../AbstractUserCase');
/** @type {typeof import('../../entidades/Outorgado')} */
const Outorgado = require("../../entidades/Outorgado");
/** @type {typeof import('../../entidades/Procuracao')} */
const Procuracao = require("../../entidades/Procuracao");
const { getFluxos } = require('../__mocks__/FluxosProcuracao');

/**
 * @typedef {{
 *  tipoFluxo: Procuracoes.TipoFluxo;
 *  idCartorio: number;
 *  dadosProcuracao: Procuracoes.DadosProcuracao;
 *  matriculaOutorgado: string;
 *  urlDocumento: string;
 *  arquivoProcuracao: Promise<string>;
 *  idSubsidiaria: number;
 *  poderes: Procuracoes.Poderes['outorganteSelecionado'];
 *  idMinutaCadastrada: string;
 *  matriculaRegistro: string;
 * }} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    cartorio: import('../../repositories/CartoriosRepository'),
 *    minuta: import('../../repositories/MinutaRepository'),
 *    outorgados: import('../../repositories/OutorgadosRepository'),
 *    procuracoes: import('../../repositories/ProcuracoesRepository'),
 *    eventos: import('../../repositories/EventosProcuracaoRepository'),
 *  },
 *  Functions: {
 *    getOneFunci: getOneFunci,
 *  },
 *  RunArguments: RunArgs,
 *  Payload: Awaited<ReturnType<UcCadastrarProcuracao['_action']>>,
 *  UseTrx: true
 * }} UcCadastrarProcuracaoTypes
 *
 * @extends {AbstractUserCase<UcCadastrarProcuracaoTypes>}
 */
class UcCadastrarProcuracao extends AbstractUserCase {
  outorgadoEntity = new Outorgado();
  procuracaoEntity = new Procuracao();
  /** @type {import('../../repositories/CartoriosRepository').Cartorio} */
  cartorio;
  /** @type {Funci} */
  outorgado;
  /** @type {string} */
  urlDocumentoGerado;
  /** @type {import('../../repositories/CartoriosRepository').Cartorio} */
  cadeiaCartorio;

  /**
   * @override
   * @param {RunArgs} props
   */
  async _checks({
    arquivoProcuracao,
    dadosProcuracao,
    idCartorio,
    matriculaOutorgado,
    poderes,
    tipoFluxo,
    urlDocumento,
    idMinutaCadastrada,
    matriculaRegistro,
  }) {
    if (!matriculaRegistro) {
      throw new Error('Usuário não está logado.');
    }

    if (idMinutaCadastrada) {
      const deleteTry = await this.repository.minuta.softDeleteMinutaCadastrada(idMinutaCadastrada, this.trx);
      const softDeleted = deleteTry === 1;

      if (!softDeleted) {
        throw new Error('Minuta cadastrada não foi encontrada.');
      }
    }

    this.fluxo = await this.#validarERetornarFluxo(tipoFluxo);

    this.#validarDadosProcuracao(dadosProcuracao, {
      urlDocumento,
      arquivoProcuracao,
    });

    this.#validarPoderes(poderes);

    [
      this.cartorio,
      this.outorgado,
      this.urlDocumentoGerado,
      this.cadeiaCartorio,
    ] = await Promise.all([
      this.#validarERetornarCartorio(idCartorio),
      this.#validarERetornarOutorgado(matriculaOutorgado),
      this.repository.procuracoes.getUrlDocumento({
        arquivoProcuracao,
        urlDocumento,
      }),
      dadosProcuracao.custoCadeia
        ? this.#validarERetornarCartorio(dadosProcuracao.cartorioCadeia)
        : null,
    ]);
  }

  /**
   * @override
   * @param {RunArgs} props
   */
  async _action({
    dadosProcuracao,
    idSubsidiaria,
    poderes,
    tipoFluxo,
    idMinutaCadastrada,
    matriculaRegistro,
  }) {
    const { id: idOutorgadoSnapshot } = await this.repository.outorgados.cadastrarOutorgado(
      this.outorgadoEntity.transformFunciOutorgado(this.outorgado),
      this.trx
    );

    const {
      custo,
      custoCadeia,
      cartorioCadeia,
      superCusto,
      zerarCusto,
      prefixoCusto,
      ...dadosProcuracaoSemCusto
    } = dadosProcuracao;

    const { id: idProcuracao } =
      await this.repository.procuracoes.cadastrarDadosProcuracao(
        {
          ...dadosProcuracaoSemCusto,
          ativo: 1,
          idCartorio: this.cartorio?.id,
          idOutorgadoSnapshot,
          urlDocumento: this.urlDocumentoGerado,
          idFluxo: tipoFluxo.idFluxo,
          idMinutaCadastrada,
          matriculaRegistro,
        },
        this.trx
      );

    await this.repository.procuracoes.cadastrarHistoricoDocumento({
      matriculaRegistro,
      idProcuracao,
      urlDocumento: this.urlDocumentoGerado,
      dataManifesto: dadosProcuracao.dataManifesto,
      mensagem: "Versão Inicial",
    }, this.trx);

    await this.repository.eventos.saveEventoWithTrx({
      idProcuracao,
      matriculaRegistro,
      prefixoCusto,
      superCusto,
      custo: zerarCusto === 1 ? 0 : custo,
      idCartorio: this.cartorio?.id,
      evento: 'Cadastro de Procuração',
      dataCusto: dadosProcuracao.dataEmissao,
    }, this.trx);

    if (this.fluxo.fluxo === getFluxos().PUBLICA && dadosProcuracao.superCusto) {
      await this.repository.eventos.saveEventoWithTrx({
        idProcuracao,
        matriculaRegistro,
        prefixoCusto,
        superCusto,
        custo: custoCadeia,
        idCartorio: this.cadeiaCartorio.id,
        evento: 'Custo da Cadeia de Procurações',
        dataCusto: dadosProcuracao.dataManifesto,
      }, this.trx);
    }

    const isFluxoSubsidiaria = this.fluxo.fluxo === getFluxos().SUBSIDIARIA;

    if (isFluxoSubsidiaria) {
      await this.repository.procuracoes.cadastrarProxy(
        {
          novaProcuracaoId: idProcuracao,
          matriculaOutorgado: this.outorgado.matricula,
          idSubsidiaria
        },
        this.trx
      );
    }

    const dadosProcuracaoSubsidiaria = this.#getDadosProcuracaoSubsidiaria({
      isFluxoSubsidiaria,
      idProcuracao,
      idSubsidiaria,
      poderes,
    });

    await this.repository.procuracoes.cadastrarProcuracaoSubsidiaria(
      dadosProcuracaoSubsidiaria,
      this.trx
    );

    const dadosCadeiaProcuracao = await this.#getDadosCadeiaProcuracao({
      isFluxoSubsidiaria,
      idProcuracao,
      poderes
    });

    await this.repository.procuracoes.cadastrarCadeiaProcuracao(
      dadosCadeiaProcuracao,
      this.trx
    );

    return "Procuração cadastrada com sucesso";
  }

  /**
   * @param {number} idCartorio
   */
  async #validarERetornarCartorio(idCartorio) {
    if (this.fluxo.fluxo === getFluxos().PARTICULAR) {
      return null;
    }

    if (!idCartorio) {
      throw new Error("Cartório é obrigatório!");
    }

    const dadosCartorio = await this.repository.cartorio.getCartorioById(
      idCartorio
    );

    if (!dadosCartorio) {
      throw new Error("Cartório não encontrado!");
    }

    return dadosCartorio;
  }

  /**
   * @param {string} matriculaOutorgado
   */
  async #validarERetornarOutorgado(matriculaOutorgado) {
    if (!matriculaOutorgado) {
      throw new Error("Informar os outorgados é obrigatório.");
    }

    const dadosFunci = await this.functions.getOneFunci(matriculaOutorgado);
    if (!dadosFunci) {
      throw new Error(`Funcionário ${matriculaOutorgado} não encontrado.`);
    }

    const { refOrganizacional, prefixos } = this.fluxo.outorgados;

    const isFuncaoOutorgadoValida = refOrganizacional?.includes(dadosFunci.refOrganizacionalFuncLotacao) ?? true;
    if (!isFuncaoOutorgadoValida) {
      throw new Error(
        `Função do funcionário ${dadosFunci.matricula} não está incluído no grupo de funções permitido.`
      );
    }

    const isPrefixoOutorgadoValido = prefixos?.includes(dadosFunci.prefixoLotacao) ?? true;
    if (!isPrefixoOutorgadoValido) {
      throw new Error(
        `Prefixo do funcionário ${dadosFunci.matricula} não está incluído no grupo de prefixos permitido.`
      );
    }

    return dadosFunci;
  }

  /**
   * @param {Procuracoes.DadosProcuracao} dadosProcuracao
   * @param {{
   *  urlDocumento?: string;
   *  arquivoProcuracao?: Promise<string>;
   * }} documentoProps
   */
  #validarDadosProcuracao(
    dadosProcuracao,
    { urlDocumento, arquivoProcuracao }
  ) {
    if (!urlDocumento && !arquivoProcuracao) {
      throw new Error("Arquivo da procuração inválido!");
    }

    const isDadosProcuracaoValido =
      this.procuracaoEntity.validarDadosProcuracao(dadosProcuracao, this.fluxo.fluxo);

    if (!isDadosProcuracaoValido) {
      throw new Error("Dados da procuração inválidos!");
    }
  }

  /**
   * @param {Procuracoes.TipoFluxo} tipoFluxo
   */
  async #validarERetornarFluxo(tipoFluxo) {
    const fluxo = await this.repository.minuta.getOneFluxoMinuta(tipoFluxo.idFluxo);
    if (!fluxo) {
      throw new Error("Fluxo não encontrado!");
    }

    if (fluxo.fluxo !== tipoFluxo.fluxo || fluxo.minuta !== tipoFluxo.minuta) {
      throw new Error("Fluxo Corrompido!");
    }

    return fluxo;
  }

  /**
   * @param {Procuracoes.Poderes['outorganteSelecionado']} poderes
   */
  #validarPoderes(poderes) {
    if (poderes) {
      const {
        matricula, idProcuracao, idProxy, subsidiariasSelected
      } = poderes;

      if (!matricula) {
        throw new Error('É necessário uma matricula de Outorgante.');
      }

      if (idProcuracao && idProxy) {
        throw new Error('Não é possível receber poderes de multiplas fontes.');
      }

      if (!Array.isArray(subsidiariasSelected) || subsidiariasSelected.length === 0) {
        throw new Error('É necessário ao menos uma subsidiária.');
      }
    }
  }

  /**
   * @param {{
   *  isFluxoSubsidiaria: boolean;
   *  idProcuracao: number;
   *  idSubsidiaria: number;
   *  poderes: Procuracoes.Poderes['outorganteSelecionado'];
   * }} props
   */
  #getDadosProcuracaoSubsidiaria({ isFluxoSubsidiaria, idProcuracao, idSubsidiaria, poderes }) {
    const dadosProcuracaoSubsidiaria = [];

    if (isFluxoSubsidiaria) {
      dadosProcuracaoSubsidiaria.push({
        idProcuracao,
        idSubsidiaria,
        direto: true,
      });
    } else {
      for (const id of poderes.subsidiariasSelected) {
        dadosProcuracaoSubsidiaria.push({
          idProcuracao,
          idSubsidiaria: id,
          direto: false,
        });
      }
    }
    return dadosProcuracaoSubsidiaria;
  }

  /**
   * @param {{
   *  isFluxoSubsidiaria: boolean;
   *  idProcuracao: number;
   *  poderes: Procuracoes.Poderes['outorganteSelecionado'];
   * }} props
   */
  async #getDadosCadeiaProcuracao({ isFluxoSubsidiaria, idProcuracao, poderes }) {
    if (isFluxoSubsidiaria) {
      return {
        idProcuracaoAtual: idProcuracao,
        idProcuracaoParent: null,
        idProxyParent: null,
      };
    } else {
      const { idProcuracao: idProcuracaoParent, idProxy: idProxyParent } = poderes;

      return {
        idProcuracaoAtual: idProcuracao,
        idProcuracaoParent,
        idProxyParent,
      };
    }
  }
}

module.exports = UcCadastrarProcuracao;
