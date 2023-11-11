import React from 'react';
import numeral from 'numeral';

numeral.register('locale', 'pt-br', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'mil',
    million: 'milhões',
    billion: 'b',
    trillion: 't'
  },
  ordinal(number) {
    return 'º';
  },
  currency: {
    symbol: 'R$'
  }
});

numeral.locale('pt-BR');

function FormataMoeda({ format, children }) {
  return <span>{numeral(children).format(format)}</span>;
}

export default FormataMoeda;
