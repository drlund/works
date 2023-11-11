class UcGetListaCartorios {
  constructor(cartoriosRepository) {
    this.cartoriosRepository = cartoriosRepository;
  }

  async run() {
    const cartorios = await this.cartoriosRepository.getCartorios();
    return cartorios;
  }
}

module.exports = UcGetListaCartorios;
