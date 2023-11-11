"use strict";

const BaseUseCase = use("App/Commons/Tarifas/useCases/BaseUseCase");

const OcorrenciaTarifaRepository = use(
  "App/Commons/Tarifas/repositories/OcorrenciaTarifaRepository"
);

const relacionamentosDefault = ["reservas", "dadosCliente"];

class GetOneOcorrencia extends BaseUseCase {
  constructor(
    idOcorrencia,
    relacionamentos = [],
    ReceivedOcorrenciaRepository = null
  ) {
    super();
    this.idOcorrencia = idOcorrencia;
    this.relacionamentos = [...relacionamentosDefault, ...relacionamentos];

    this.ocorrenciaRepository = ReceivedOcorrenciaRepository
      ? new ReceivedOcorrenciaRepository()
      : new OcorrenciaTarifaRepository();
  }

  async run() {
    const ocorrencia = await this.ocorrenciaRepository.getOneOcorrencia(
      this.idOcorrencia,
      this.relacionamentos
    );

    if (!ocorrencia) {
      throw { message: "Id da ocorrência inválido" };
    }
    
    return ocorrencia;
  }
}

module.exports = GetOneOcorrencia;
