const CartoriosModel = use("App/Models/Mysql/Procuracao/Cartorio");

/**
 * @typedef {{
 *  id: number;
 *  cnpj: string;
 *  nome: string;
 *  ativo: 1|0;
 * }} Cartorio
 */

class CartoriosRepository {
  async getCartorios() {
    const cartorios = await CartoriosModel.query().where("ativo", 1).fetch();
    return cartorios.toJSON();
  }

  async cadastrarCartorio(dadosCartorio) {
    await CartoriosModel.create(dadosCartorio);
  }

  async getCartorioById(idCartorio) {
    const cartorio = await CartoriosModel.query()
      .where("id", idCartorio)
      .where("ativo", 1)
      .first();

    return /** @type {Cartorio} */(cartorio ? cartorio.toJSON() : null);
  }
}
module.exports = CartoriosRepository;
