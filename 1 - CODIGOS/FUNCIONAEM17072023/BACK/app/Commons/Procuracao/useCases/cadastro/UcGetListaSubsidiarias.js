class UcGetListaSubsidiarias {
  constructor(subsidiariasRepository) {
    this.subsidiariasRepository = subsidiariasRepository;
  }

  async run() {
    const subsidiarias = await this.subsidiariasRepository.getSubsidiarias();
    return subsidiarias;
  }
}

module.exports = UcGetListaSubsidiarias;
