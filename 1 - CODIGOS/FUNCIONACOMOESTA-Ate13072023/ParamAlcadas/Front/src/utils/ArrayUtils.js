module.exports = {
  arrayToString: (lista, ponto = false) => {
    if (!Array.isArray(lista)) {
      throw new Error('Valor recebido deve ser um array!');
    }

    const last = lista.slice(-1)[0];

    if (!last) {
      return '';
    }

    let result = lista.slice(0, -1).join(', ');

    if (result !== '') {
      result += ' e ';
    }

    result += last;

    if (ponto) {
      result += '.';
    }

    return result;
  },
};
