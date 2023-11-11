"use strict";

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);
const OcorrenciaTarifaRepository = use(
  "App/Commons/Tarifas/repositories/OcorrenciaTarifaRepository"
);

class GetPermissaoPgtoConta {
  constructor(
    dadosUsuario,
    ReceivedUsuarioRepository = null,
    ReceivedOcorrenciaRepository = null
  ) {
    this.usuarioRepository = ReceivedUsuarioRepository
      ? new ReceivedUsuarioRepository()
      : new UsuarioRepository(dadosUsuario);
    this.ocorrenciaTarifaRepository = ReceivedOcorrenciaRepository
      ? new ReceivedOcorrenciaRepository()
      : new OcorrenciaTarifaRepository();
    this.dadosUsuario = dadosUsuario;
  }

  async run() {
    const podePagarEmConta = await this.usuarioRepository.podePagarEmConta();
    const isAdmin = await this.usuarioRepository.isAdminTarifas();
    return podePagarEmConta || isAdmin;
  }
}

module.exports = GetPermissaoPgtoConta;
