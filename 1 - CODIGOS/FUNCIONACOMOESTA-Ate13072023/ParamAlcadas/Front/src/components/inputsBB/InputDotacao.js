import React, { useEffect, useState, useCallback } from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { fetchDotacao } from 'pages/designacao/apiCalls/fetch';

const { Option } = Select;

function InputDotacao({
  disabled,
  dotacao,
  ger,
  gest,
  onChange,
  prefixo,
  style,
}) {
  const [, setFuncao] = useState({ key: '', label: '' });
  const [dotation, setDotation] = useState([]);
  const [value, setValue] = useState({ key: '', label: '' });
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setarValue = (valor) => {
    setValue(valor);
  };

  const resetarValue = () => {
    setValue(null);
  };

  const resetarFuncao = () => {
    setFuncao({ key: '', label: '' });
  };

  const setarDotation = (aDotacao) => {
    setDotation(aDotacao);
  };

  const resetarDotation = () => {
    setDotation([]);
  };

  const handleChange = (valor) => {
    let dota = [];
    let terGUN = '';
    let qtdeFuncis = '';

    if (dotacao && !!valor) {
      dota = dotation.dotacao.filter((elem) => elem.codFuncao === valor.value);
      terGUN = dotation.terGUN;
      qtdeFuncis = dotation.qtdeFuncis;
    } else {
      resetarValue();
    }

    setarValue(valor);

    onChange(valor, { dotacao: dota, terGUN, qtdeFuncis });
  };

  useEffect(() => {
    startLoading();
    resetarFuncao();
    fetchDotacao(prefixo, ger, gest)
      .then((dot) => setarDotation(dot))
      .catch((err) => message.error(err) && resetarDotation())
      .then(() => stopLoading());
  }, [prefixo, ger, gest]);

  const OptionsFuncoes = useCallback(() => {
    if (_.isEmpty(dotation)) {
      return <Option disabled key={0}>Prefixo sem Funções Acionáveis</Option>;
    }
    return dotation.dotacao.map((elem) => {
      const option = `${elem.codFuncao} ${elem.nmFuncao}`;
      return <Option key={elem.codFuncao}>{option}</Option>;
    });
  }, [dotation]);

  return (
    <Select
      onChange={handleChange}
      labelInValue
      placeholder="Escolha a Função desejada"
      allowClear
      value={value}
      loading={loading}
      disabled={disabled || loading}
      notFoundContent={loading ? <Spin size="small" /> : null}
      style={style}
    >
      {OptionsFuncoes()}
    </Select>
  );
}

export default React.memo(InputDotacao);
