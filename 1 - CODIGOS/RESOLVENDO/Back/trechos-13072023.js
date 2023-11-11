// repositório
async buscarRegistros(id, prefixoDestino, comissaoDestino) {
    const registros = await ParamAlcadas.query()
      .where("id", id)
      .where({ prefixoDestino: `${prefixoDestino}` })
      .where({ comissaoDestino: `${comissaoDestino}` })
      .update({ ativo: 1 });

    const registroAtualizado = registros ? registros.toJSON() : [];

    return registroAtualizado;
  }

  // A useCase

  
class UcBuscarRegistro {
    /**
     * @param {import("../Repositories/ParametrosAlcadasRepository")} ParametrosAlcadasRepository
     */
    constructor(ParametrosAlcadasRepository, ) {
      this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
      this.validated = false;
    }
  
    async validate(id, comissaoDestino, prefixoDestino) {
      this.id = id;
      this.prefixoDestino = prefixoDestino;
      this.comissaoDestino = comissaoDestino;
      this.validated = true;
    }
  
    async run() {
      if (this.validated === false) {
        throw new exception(
          `O método validate() deve ser chamado antes do run()`,
          500
        );
      }
  
      const registroEncontrado = await this.ParametrosAlcadasRepository.buscarRegistros(this.id, this.prefixoDestino, this.comissaoDestino);
  
      return registroEncontrado;
    }
    }
  
    module.exports = UcBuscarRegistro;

    // Controller
     
  async buscarRegistro({ request, response }) {

    const {prefixoDestino, comissaoDestino} = request.post();
    const ucBuscarRegistro = new UcBuscarRegistro(new ParametrosAlcadasRepository());
    await ucBuscarRegistro.validate(prefixoDestino, comissaoDestino);
    const listaRegistros = await ucBuscarRegistro.run();

    response.ok(listaRegistros);
}