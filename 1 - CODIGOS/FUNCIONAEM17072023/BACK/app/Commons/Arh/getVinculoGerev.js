const exception = use('App/Exceptions/Handler');
const Dipes = use('App/Models/Mysql/Dipes');
const MestreSas = use('App/Models/Mysql/MestreSas');
const _ = require('lodash');
const isPrefixoUT = use('App/Commons/Arh/isPrefixoUT');

/**
 * Metodo utilitario que verifica se uma comissao pertence a algum nivel gerencial.
 * Consulta efetuada na tabela superadm.cargos_e_comissoes.
 */
module.exports = async (usuario) => {

  if (await isPrefixoUT(usuario.prefixo)) {

    try {
      const vinculo = await MestreSas.query()
        .table("vinculo_gerev")
        .where("uor_trabalho", usuario.uor_trabalho)
        .first();

      if (vinculo) {
        usuario.uor_trabalho = vinculo.uor_trabalho;
      }

    } catch (error) {
      throw new Exception('Problema ao acessar o Mestre.');
    }

  }

  return usuario.uor_trabalho;
}