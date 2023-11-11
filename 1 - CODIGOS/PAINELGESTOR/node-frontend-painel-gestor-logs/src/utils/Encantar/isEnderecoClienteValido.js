/**
 *  Verifica se o endereço do cliente é válido
 * @param {*} enderecoCliente
 * @returns {Boolean} Indica se o endereço é válido ou não
 */
const isEnderecoClienteValido = (enderecoCliente) => {
  if (
    !enderecoCliente.cep ||
    !enderecoCliente.endereco ||
    !enderecoCliente.numero ||
    !enderecoCliente.bairro ||
    !enderecoCliente.cidade ||
    enderecoCliente.cep === "" ||
    enderecoCliente.cep.replace("-","").length !== 8 ||
    enderecoCliente.endereco === "" ||
    enderecoCliente.numero === "" ||
    enderecoCliente.bairro === "" ||
    enderecoCliente.cidade === ""
  ) {
    return false;
  }
  return true;
};

export default isEnderecoClienteValido;
