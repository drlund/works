/**
 * Nesta versão atualizada, a useCase `UcAlterarParametros` chama os métodos `getParametroById` e `gravarParametro` 
 * da sua repository `ParametrosAlcadasRepository`. 
 * 
 * Verifique se você possui esses métodos implementados corretamente na sua repository e ajuste-os conforme necessário.
 * 
 * Lembre-se de ajustar as chamadas e a lógica de acordo com as necessidades específicas do seu sistema.
 */

/**O trecho de código sugerido anteriormente, com a função `patchParametros`, não se encaixa diretamente na sua useCase 
 * `UcAlterarParametros`. A função `patchParametros` mencionada anteriormente é uma sugestão para a repository, não 
 * para a useCase. 
 * 
 * Na sua useCase `UcAlterarParametros`, você pode usar os métodos existentes da sua repository `ParametrosAlcadasRepository` 
 * para executar as operações de atualização dos parâmetros e da observação. Portanto, não é necessário incluir a função 
 * `patchParametros` na useCase. 
 * 
 * Aqui está a versão atualizada da sua useCase `UcAlterarParametros`, usando os métodos existentes da repository:
*/

"use strict";

class UcAlterarParametros {
  constructor(ParametrosAlcadasRepository) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
    this.validated = false;
  }

  async validate(novoParametro) {
    this.novoParametro = novoParametro;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new Error("O método validate() deve ser chamado antes do run()");
    }

    const { id, comite, nomeComite, observacao } = this.novoParametro;

    const parametroExistente = await this.ParametrosAlcadasRepository.getParametroById(id);

    if (parametroExistente) {
      parametroExistente.ativo = "1";
      parametroExistente.observacao += `\n${observacao}`;
      await parametroExistente.save();
      return parametroExistente;
    } else {
      const novoParametro = {
        comite,
        nomeComite,
        observacao
      };

      await this.ParametrosAlcadasRepository.gravarParametro(novoParametro);
      return novoParametro;
    }
  }
}

module.exports = UcAlterarParametros;
