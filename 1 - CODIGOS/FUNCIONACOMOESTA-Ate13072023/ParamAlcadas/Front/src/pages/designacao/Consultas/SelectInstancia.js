import React, { useCallback, useEffect, useState } from 'react';
import { message, Select } from 'antd';
import { obterOptionsInstancias } from '../apiCalls/fetch';

const { Option } = Select;

function SelectInstancia({
  disabled,
  style,
  onChange
}) {
  const [instancias, setInstancias] = useState([]);
  const [instancia, setInstancia] = useState();

  useEffect(() => {
    preencherSelectInstancias();
  }, []);

  const preencherSelectInstancias = useCallback(() => {
    obterOptionsInstancias()
      .then((insts) => setInstancias(insts))
      .catch(() => message.error('Não foi possível recuperar as instâncias'));
  });

  const fillOptions = () => instancias.map((elem) => <Option key={elem.id}>{elem.local}</Option>);

  const onOptionChange = (value) => {
    setInstancia(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      mode="multiple"
      value={instancia}
      disabled={disabled}
      labelInValue
      placeholder="Selecione uma instância"
      style={style}
      defaultActiveFirstOption={false}
      filterOption
      onChange={onOptionChange}
    >
      {fillOptions()}
    </Select>
  );
}

export default React.memo(SelectInstancia);
